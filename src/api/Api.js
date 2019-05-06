import shortid from "shortid";
import PouchDB from "pouchdb";
import CryptoUtil from "@/utils/CryptoUtil";

shortid.characters(
    "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ$@"
);
const db = PouchDB("mknote-notes");
const security = PouchDB("mknote-security");
const settings = PouchDB("mknote-settings");
const remote = PouchDB("mknote-remote");

const databases = {
    "mknote-notes": db,
    "mknote-security": security,
    "mknote-settings": settings,
    "mknote-remote": remote
};
const remoteDatabases = ["mknote-notes", "mknote-security"];

export default {
    syncHandler: {},
    async getNotes(decrypt = true) {
        const records = await db.allDocs({
            include_docs: true,
            attachments: true
        });
        const docs = [];
        records.rows.forEach(row => {
            if (decrypt) {
                row.doc.title = CryptoUtil.decryptString(row.doc.title);
                row.doc.value = CryptoUtil.decryptString(row.doc.value);
            }
            docs.push(row.doc);
        });
        return docs;
    },
    getNote(id) {},
    async putAttachment(id, name, mime, data) {
        const doc = await db.get(id);
        var blob = new Blob([data], {
            type: mime
        });
        const response = await db.putAttachment(id, name, doc._rev, blob, mime);
        return response;
    },
    async getAttachment(id, name) {
        const blob = await db.getAttachment(id, name);
        return blob;
    },
    async updateNote(payload) {
        const title = CryptoUtil.encryptString(payload.title);
        const value = CryptoUtil.encryptString(payload.value);
        const doc = await db.get(payload._id);
        doc.title = title;
        doc.value = value;
        await db.put(doc);
    },
    async addNote() {
        const newId = shortid.generate();
        const title = CryptoUtil.encryptString("");
        const value = CryptoUtil.encryptString("");
        const newNode = {
            _id: newId,
            title: title,
            value: value,
            created: Date.now()
        };

        const responseNode = await db.put(newNode);
        newNode._rev = responseNode._rev;
        newNode.title = "";
        newNode.value = "";
        return newNode;
    },
    async removeNote(id) {
        const doc = await db.get(id);
        await db.remove(doc);
    },
    async export() {
        const docs = await this.getNotes(false);
        const rawDocs = JSON.stringify(docs);
        var blob = new Blob([rawDocs], { type: "application/json" });
        return blob;
    },
    async initSecret(secret) {
        const hash = CryptoUtil.hashString(secret);
        await security.put({
            _id: "secret",
            secret: hash
        });
    },
    async updateSecret(secret) {
        var storedSecret = await security.get("secret");
        storedSecret.secret = CryptoUtil.hashString(secret);
        await security.put(storedSecret);
    },
    async getSecret() {
        return await security.get("secret");
    },
    async renewEncryption(oldSecret) {
        const notes = await this.getNotes(false);
        const scope = this;
        await notes.forEach(async note => {
            note.title = CryptoUtil.decryptString(note.title, oldSecret);
            note.value = CryptoUtil.decryptString(note.value, oldSecret);
            await scope.updateNote(note);
        });
    },
    async getSettings() {
        const currentSettings = await settings.get("settings");
        return currentSettings.settings;
    },
    async setSettings(newSettings) {
        try {
            const currentSettings = await settings.get("settings");
            currentSettings.settings = newSettings;
            await settings.put(currentSettings);
        } catch (error) {
            await settings.put({
                _id: "settings",
                settings: newSettings
            });
        }
    },
    async getRemote() {
        try {
            const currentRemote = await remote.get("remote");
            return currentRemote.remote;
        } catch (error) {
            throw error;
        }
    },
    async setRemote(newRemote) {
        try {
            const currentRemote = await remote.get("remote");
            currentRemote.remote = newRemote;
            await remote.put(currentRemote);
        } catch (error) {
            await remote.put({
                _id: "remote",
                remote: newRemote
            });
        }
    },
    async updateRemoteConnections(enabled, url, live = true) {
        if (enabled) {
            await remoteDatabases.forEach(async remoteDBID => {
                await this._cancelRemoteConnection(remoteDBID);
                const remoteDB = PouchDB(url + "/" + remoteDBID);
                const syncHandler = this._initRemoteConnection(
                    databases[remoteDBID],
                    remoteDB,
                    live
                );
                this.syncHandler[remoteDBID] = syncHandler;
            });
            // http://localhost:5984/mknotes
        } else {
            console.log(await this._cancelAllRemoteConnection());
        }
        this.setRemote({ enabled: enabled, url: url, live: live });
    },
    _initRemoteConnection(db, remoteDB, live) {
        const syncHandler = db
            .sync(remoteDB, {
                live: live,
                retry: true
            })
            .on("change", change => {
                console.log("CouchDB sync: change", change);
            })
            .on("paused", info => {
                console.log("CouchDB sync: paused", info);
            })
            .on("active", info => {
                console.log("CouchDB sync: active", info);
            })
            .on("error", error => {
                console.log("CouchDB sync: error", error);
            });
        return syncHandler;
    },
    async _cancelAllRemoteConnection() {
        Object.keys(this.syncHandler).forEach(
            async (syncHandlerID, syncHandler) => {
                await this._cancelRemoteConnection(syncHandlerID);
            }
        );
    },
    _cancelRemoteConnection(syncHandlerID) {
        return new Promise((resolve, reject) => {
            console.log(this.syncHandler[syncHandlerID]);
            if (this.syncHandler[syncHandlerID]) {
                const syncHandler = this.syncHandler[syncHandlerID];
                syncHandler.cancel();
                syncHandler.on("complete", info => {
                    console.log("CouchDB sync: canceled", info);
                    this.syncHandler[syncHandlerID] = null;
                    resolve("Cancelation complete");
                });
            } else {
                resolve("No cancelation needed");
            }
        });
    }
};

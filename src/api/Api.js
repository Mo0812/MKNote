import shortid from "shortid";
import PouchDB from "pouchdb";
import CryptoUtil from "@/utils/CryptoUtil";
import RemoteConnectionError from "@/error/RemoteConnectionError";

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
        try {
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
        } catch (error) {
            throw error;
        }
    },
    async putAttachment(id, name, mime, data) {
        try {
            const doc = await db.get(id);
            var blob = new Blob([data], {
                type: mime
            });
            const response = await db.putAttachment(
                id,
                name,
                doc._rev,
                blob,
                mime
            );
            return response;
        } catch (error) {
            throw error;
        }
    },
    async getAttachment(id, name) {
        try {
            const blob = await db.getAttachment(id, name);
            return blob;
        } catch (error) {
            throw error;
        }
    },
    async updateNote(payload) {
        try {
            const title = CryptoUtil.encryptString(payload.title);
            const value = CryptoUtil.encryptString(payload.value);
            const doc = await db.get(payload._id);
            doc.title = title;
            doc.value = value;
            await db.put(doc);
        } catch (error) {
            throw error;
        }
    },
    async addNote() {
        try {
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
        } catch (error) {
            throw error;
        }
    },
    async removeNote(id) {
        try {
            const doc = await db.get(id);
            await db.remove(doc);
        } catch (error) {
            throw error;
        }
    },
    async export() {
        try {
            const docs = await this.getNotes(false);
            const rawDocs = JSON.stringify(docs);
            var blob = new Blob([rawDocs], { type: "application/json" });
            return blob;
        } catch (error) {
            throw error;
        }
    },
    async initSecret(secret) {
        try {
            const hash = CryptoUtil.hashString(secret);
            await security.put({
                _id: "secret",
                secret: hash
            });
        } catch (error) {
            throw error;
        }
    },
    async updateSecret(secret) {
        try {
            var storedSecret = await security.get("secret");
            storedSecret.secret = CryptoUtil.hashString(secret);
            await security.put(storedSecret);
        } catch (error) {
            throw error;
        }
    },
    async getSecret() {
        try {
            return await security.get("secret");
        } catch (error) {
            throw error;
        }
    },
    async renewEncryption(oldSecret) {
        try {
            const notes = await this.getNotes(false);
            const scope = this;
            await notes.forEach(async note => {
                note.title = CryptoUtil.decryptString(note.title, oldSecret);
                note.value = CryptoUtil.decryptString(note.value, oldSecret);
                await scope.updateNote(note);
            });
        } catch (error) {
            throw error;
        }
    },
    async getSettings() {
        try {
            const currentSettings = await settings.get("settings");
            return currentSettings.settings;
        } catch (error) {
            throw error;
        }
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
            if (await this._checkRemoteConnection(url)) {
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
            } else {
                throw new RemoteConnectionError("Error in remote connection");
            }
        } else {
            await this._cancelAllRemoteConnection();
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
    async _checkRemoteConnection(url) {
        try {
            const response = await fetch(url);
            if (response.ok) {
                return await this._checkRemoteSecret(url);
            } else {
                return false;
            }
        } catch (error) {
            return false;
        }
    },
    async _checkRemoteSecret(url) {
        try {
            const remoteDB = PouchDB(url + "/" + "mknote-security");
            const remoteSecurityData = await remoteDB.get("secret");
            const localSecurityData = await security.get("secret");
            return remoteSecurityData.secret === localSecurityData.secret;
        } catch (error) {
            return error.status === 404;
        }
    },
    async _cancelAllRemoteConnection() {
        Object.keys(this.syncHandler).forEach(async syncHandlerID => {
            await this._cancelRemoteConnection(syncHandlerID);
        });
    },
    _cancelRemoteConnection(syncHandlerID) {
        return new Promise(resolve => {
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

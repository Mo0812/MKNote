import shortid from "shortid";
import PouchDB from "pouchdb";

shortid.characters(
    "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ$@"
);
const db = PouchDB("mknotes");

export default {
    async getNotes() {
        const records = await db.allDocs({
            include_docs: true,
            attachments: true
        });
        const docs = [];
        records.rows.forEach(row => {
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
    async updateNote(payload) {
        const doc = await db.get(payload._id);
        doc.title = payload.title;
        doc.value = payload.value;
        await db.put(doc);
    },
    async addNote() {
        const newId = shortid.generate();
        const newNode = {
            _id: newId,
            title: "",
            value: "",
            created: Date.now()
        };
        const responseNode = await db.put(newNode);
        newNode._rev = responseNode._rev;
        return newNode;
    },
    async removeNote(id) {
        const doc = await db.get(id);
        await db.remove(doc);
    }
};

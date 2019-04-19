<template>
    <section class="note-preview h-100" v-html="value"></section>
</template>

<script>
import showdown from "showdown";
import PouchDB from "pouchdb";
import * as blobUtil from "blob-util";

import "./NotePreview.scss";

export default {
    name: "NotePreview",
    props: ["note"],
    data() {
        return {
            converter: null,
            value: null,
            cache: {}
        };
    },
    created() {
        showdown.setFlavor("github");
        showdown.setOption("emoji", true);
        showdown.setOption("tasklists", true);
        showdown.setOption("smoothLivePreview", true);
        showdown.setOption("ghCodeBlocks", true);
        showdown.setOption("tables", true);
        showdown.setOption("strikethrough", true);
        this.converter = new showdown.Converter();
    },
    mounted() {
        this.processMarkdown();
    },
    watch: {
        note: {
            handler(newVal, oldVal) {
                this.processMarkdown();
            },
            deep: true
        }
    },
    methods: {
        async processMarkdown() {
            const note = this.note;
            if (note) {
                const content = await this.processDatabaseEntries(note.value);
                const output = this.converter.makeHtml(content);
                this.value = output;
            }
        },
        async processDatabaseEntries(content) {
            const regEx = /(?:!\[(.*?)\]\(note:(.*?)\))/gm;
            var match = regEx.exec(content);
            while (match !== null) {
                var identifier = match[2];
                identifier = identifier.replace("note:", "");
                const attachment = this.note._attachments[identifier];
                const blob = blobUtil.base64StringToBlob(attachment.data);
                content = content.replace(
                    "note:" + identifier,
                    blobUtil.createObjectURL(blob)
                );
                /*if (this.cache[identifier]) {
                    content = content.replace(
                        "note:" + identifier,
                        this.cache[identifier]
                    );
                } else {
                    const db = PouchDB("mknotes");
                    const blob = await db.getAttachment(
                        this.note._id,
                        identifier
                    );
                    const data = await this.readBlob(blob);
                    this.cache[identifier] = data;
                    content = content.replace("note:" + identifier, data);
                }*/
                match = regEx.exec(content);
            }
            return content;
        },
        readBlob(blob) {
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = () => {
                    resolve(reader.result);
                };
                reader.onerror = reject;
                reader.readAsText(blob, "base64");
            });
        }
    }
};
</script>

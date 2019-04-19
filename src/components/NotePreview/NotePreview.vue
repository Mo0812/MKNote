<template>
    <section class="note-preview h-100" v-html="value"></section>
</template>

<script>
import showdown from "showdown";
import Api from "@/api/Api";
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
        this.preProcessMarkdown();
    },
    watch: {
        note: {
            handler(newVal, oldVal) {
                this.preProcessMarkdown();
            },
            deep: true
        }
    },
    methods: {
        async preProcessMarkdown() {
            const note = this.note;
            if (note) {
                const content = await this.processDatabaseEntries(note.value);
                const output = this.converter.makeHtml(content);
                this.value = output;
            } else {
                this.value = null;
            }
        },
        async processDatabaseEntries(content) {
            const regEx = /(?:!\[(.*?)\]\(note:(.*?)\))/gm;
            var match = regEx.exec(content);
            while (match !== null) {
                var identifier = match[2];
                identifier = identifier.replace("note:", "");
                var data = null;

                if (identifier in this.cache) {
                    data = this.cache[identifier];
                } else {
                    var blob = null;
                    if (
                        "_attachments" in this.note &&
                        identifier in this.note._attachments
                    ) {
                        const attachment = this.note._attachments[identifier];
                        blob = blobUtil.base64StringToBlob(attachment.data);
                    } else {
                        blob = await Api.getAttachment(
                            this.note._id,
                            identifier
                        );
                    }
                    data = blobUtil.createObjectURL(blob);
                    this.cache[identifier] = data;
                }
                content = content.replace("note:" + identifier, data);
                match = regEx.exec(content);
            }
            return content;
        }
    }
};
</script>

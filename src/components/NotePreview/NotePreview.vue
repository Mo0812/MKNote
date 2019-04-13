<template>
    <section class="note-preview h-100" v-html="noteValue"></section>
</template>

<script>
import showdown from "showdown";

import "./NotePreview.scss";

export default {
    name: "NotePreview",
    props: ["note"],
    data() {
        return {
            converter: null
        };
    },
    computed: {
        noteValue() {
            const note = this.note;
            var output = null;
            if (note) {
                output = this.converter.makeHtml(note.value);
            }
            return output;
        }
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
    }
};
</script>

<template>
    <section class="note-preview" v-html="noteValue"></section>
</template>

<script>
import showdown from "showdown";
export default {
    name: "NotePreview",
    data() {
        return {
            converter: null
        };
    },
    computed: {
        noteValue() {
            const note = this.$store.getters.getNote;
            return this.converter.makeHtml(note.value);
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

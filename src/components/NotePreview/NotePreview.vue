<template>
    <section class="note-preview h-100" v-html="noteValue"></section>
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
            const note = this.$store.getters.getNoteOpen;
            if (note) {
                return this.converter.makeHtml(note.value);
            }
            return null;
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

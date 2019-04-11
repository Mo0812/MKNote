<template>
    <section class="note-editor">
        <textarea id="md-textarea" ref="mdtextarea">{{noteValue}}</textarea>
    </section>
</template>

<script>
import CodeMirror from "codemirror";
import "codemirror/lib/codemirror.css";
import "codemirror/mode/markdown/markdown";
import "codemirror/theme/darcula.css";

import "./NoteEditor.scss";

export default {
    name: "NoteEditor",
    data() {
        return {
            editor: null,
            editorValue: "",
            currentNoteId: ""
        };
    },
    computed: {
        noteValue() {
            const note = this.$store.getters.getNoteOpen;
            this.currentNoteId = note.id;
            return note.value;
        }
    },
    mounted() {
        const mdTextarea = this.$refs.mdtextarea;
        this.editor = CodeMirror.fromTextArea(mdTextarea, {
            mode: "markdown",
            theme: "darcula",
            lineWrapping: true
        });
        var scope = this;
        this.editor.on("change", editor => {
            const currentValue = editor.getValue();
            scope.editorValue = currentValue;
            scope.$store.dispatch("updateNote", {
                id: this.currentNoteId,
                value: currentValue
            });
        });
    }
};
</script>
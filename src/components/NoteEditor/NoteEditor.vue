<template>
    <section class="note-editor">
        <textarea id="md-textarea" ref="mdtextarea">{{note.value}}</textarea>
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
            currentNoteId: ""
        };
    },
    computed: {
        note() {
            const note = this.$store.getters.getNoteOpen;
            this.refreshEditor(note);
            this.currentNoteId = note.id;
            return note;
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
            scope.$store.dispatch("updateNote", {
                id: this.note.id,
                value: currentValue
            });
        });
    },
    methods: {
        refreshEditor(note) {
            if (this.currentNoteId !== note.id && this.editor !== null) {
                this.editor.setValue(note.value);
                this.editor.refresh();
            }
        }
    }
};
</script>
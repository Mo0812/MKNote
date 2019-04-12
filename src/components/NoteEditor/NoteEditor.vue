<template>
    <section class="note-editor h-100">
        <div v-if="note" class="note-editor-container h-100">
            <textarea id="md-textarea" ref="mdtextarea">{{note.value}}</textarea>
        </div>
        <h2 v-else>Wählen Sie zuerst eine Notiz aus oder erstellen Sie eine neue Notiz</h2>
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
            currentNoteId: null
        };
    },
    computed: {
        note() {
            const note = this.$store.getters.getNoteOpen;
            if (note !== null) {
                this.refreshEditor(note);
                this.currentNoteId = note.id;
                return note;
            }
            return null;
        }
    },
    mounted() {
        if (this.note) {
            this.initEditor();
        }
    },
    updated() {
        if (this.note) {
            this.initEditor();
        } else {
            this.removeEditor();
        }
    },
    methods: {
        initEditor() {
            if (!this.editor) {
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
            }
        },
        refreshEditor(note) {
            if (this.currentNoteId !== note.id && this.editor !== null) {
                this.editor.setValue(note.value);
                this.editor.refresh();
            }
        },
        removeEditor() {
            if (this.editor) {
                var wrapper = this.editor.getWrapperElement();
                wrapper.remove();
                this.editor = null;
            }
        }
    }
};
</script>
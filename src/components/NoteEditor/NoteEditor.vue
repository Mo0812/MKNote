<template>
    <section class="note-editor h-100">
        <div v-if="note" class="note-editor-container h-100">
            <textarea id="md-textarea" ref="mdtextarea"/>
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
    props: ["note"],
    data() {
        return {
            editor: null
        };
    },
    mounted() {
        this.initEditor();
    },
    updated() {
        this.initEditor();
    },
    methods: {
        initEditor() {
            if (!this.editor && this.note) {
                const mdTextarea = this.$refs.mdtextarea;
                this.editor = CodeMirror.fromTextArea(mdTextarea, {
                    mode: "markdown",
                    theme: "darcula",
                    lineWrapping: true
                });
                var scope = this;
                this.editor.on("change", editor => {
                    const currentValue = editor.getValue();
                    scope.$emit("update", {
                        id: this.note.id,
                        value: currentValue
                    });
                });
            }
            this.refreshEditor();
        },
        refreshEditor() {
            if (this.editor && this.note) {
                this.editor.setValue(this.note.value);
                this.editor.refresh();
            }
        }
    }
};
</script>
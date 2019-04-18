<template>
    <section class="note-editor h-100">
        <div v-if="note" class="note-editor-container h-100">
            <b-form-input
                class="note-title note-title-input"
                placeholder="Title"
                size="lg"
                v-model="note.title"
                @update="update"
            ></b-form-input>
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
                    if (currentValue !== scope.note.value) {
                        scope.update();
                    }
                });
                this.editor.on("drop", (editor, evt) => {
                    this.addImage(evt);
                });
            }
            this.refreshEditor();
        },
        refreshEditor() {
            if (this.editor && this.note) {
                this.editor.setValue(this.note.value);
                this.editor.refresh();
            }
        },
        update() {
            const note = {
                _id: this.note._id,
                title: this.note.title,
                value: this.editor.getValue()
            };
            this.$emit("updateNote", note);
        },
        addImage(evt) {
            evt.preventDefault();
            evt.stopPropagation();
            console.log(evt.dataTransfer.files);
            var reader = new FileReader();
            reader.readAsDataURL(evt.dataTransfer.files[0]);
            reader.onload = function() {
                var fileContent = reader.result;
                console.log(fileContent);
                // Following: https://pouchdb.com/guides/attachments.html
            };
        }
    }
};
</script>
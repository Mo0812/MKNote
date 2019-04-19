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

import Api from "@/api/Api";
import Jimp from "jimp";

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
                    evt.preventDefault();
                    evt.stopPropagation();
                    const scope = this;
                    const files = evt.dataTransfer.files;
                    var reader = new FileReader();
                    for (var i = 0; i < files.length; i++) {
                        const file = files.item(i);
                        var uploadedFile = {};
                        uploadedFile.name = file.name;
                        uploadedFile.mime = file.type;
                        uploadedFile.size = file.size;
                        reader.readAsDataURL(file);
                        reader.onload = function() {
                            var fileContent = reader.result;

                            Jimp.read(fileContent)
                                .then(image => {
                                    image.resize(1200, Jimp.AUTO);
                                    image.quality(60);
                                    return image.getBufferAsync(
                                        uploadedFile.mime
                                    );
                                })
                                .then(result => {
                                    uploadedFile.data = result;
                                    Api.putAttachment(
                                        scope.note._id,
                                        uploadedFile.name,
                                        uploadedFile.mime,
                                        uploadedFile.data
                                    )
                                        .then(result => {
                                            const data =
                                                "![" +
                                                uploadedFile.name +
                                                "](note:" +
                                                uploadedFile.name +
                                                ")";
                                            const doc = editor.getDoc();
                                            const cursor = doc.getCursor();
                                            const line = doc.getLine(
                                                cursor.line
                                            );
                                            var pos = {
                                                line: cursor.line
                                            };
                                            if (line.length === 0) {
                                                // check if the line is empty
                                                // add the data
                                                doc.replaceRange(data, pos);
                                            } else {
                                                // add a new line and the data
                                                doc.replaceRange(
                                                    "\n" + data,
                                                    pos
                                                );
                                            }
                                        })
                                        .catch(error => {
                                            console.log(error);
                                        });
                                })
                                .catch(error => {
                                    console.log(error);
                                });
                            // Following: https://pouchdb.com/guides/attachments.html
                        };
                    }
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
        }
    }
};
</script>
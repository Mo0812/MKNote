<template>
    <section class="note-editor">
        <div v-if="note" class="note-editor-container">
            <b-alert variant="primary" :show="busy.uploading">
                <h5 class="alert-heading">Uploading Image</h5>
                <hr>
                <b-spinner small label="Loading..." class="mx-auto mb-3 d-block"></b-spinner>
                <p>Your image get currently uploaded and will be displayed if finished</p>
                <b-progress
                    :value="busy.progress"
                    :max="100"
                    variant="secondary"
                    striped
                    :animated="true"
                    class="mb-3"
                ></b-progress>
            </b-alert>
            <b-form-input
                class="note-title note-title-input"
                placeholder="Title"
                size="lg"
                v-model="note.title"
                @update="update"
            ></b-form-input>
            <textarea id="md-textarea" ref="mdtextarea"/>
        </div>
        <div v-else class="note-editor-container">
            <b-row class="h-100 justify-content-center align-items-center text-center">
                <b-col cols="12">
                    <h3>{{$t("notes.editor.emptyMessage")}}</h3>
                </b-col>
            </b-row>
        </div>
    </section>
</template>

<script>
import CodeMirror from "codemirror";
import "codemirror/lib/codemirror.css";
import "codemirror/mode/markdown/markdown";
import "codemirror/theme/darcula.css";

import Api from "@/api/Api";
import ImageUtil from "@/utils/ImageUtil";
import FileUtil from "@/utils/FileUtil";

import "./NoteEditor.scss";

export default {
    name: "NoteEditor",
    props: ["note"],
    data() {
        return {
            editor: null,
            busy: {
                uploading: false,
                progress: 0
            }
        };
    },
    mounted() {
        this.initEditor();
    },
    updated() {
        this.initEditor();
    },
    watch: {
        note: {
            handler(newVal, oldVal) {
                if (newVal) {
                    if (oldVal === null || newVal._id !== oldVal._id) {
                        this.refreshEditor();
                    }
                } else {
                    this.removeEditor();
                }
            },
            deep: true
        }
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
                this.refreshEditor();
                var scope = this;
                this.editor.on("change", editor => {
                    const currentValue = editor.getValue();
                    if (currentValue !== scope.note.value) {
                        scope.update();
                    }
                });
                this.editor.on("drop", async (editor, evt) => {
                    this.busy.uploading = true;
                    this.busy.progress = 0;
                    evt.preventDefault();
                    evt.stopPropagation();
                    const files = evt.dataTransfer.files;
                    for (var i = 0; i < files.length; i++) {
                        const file = files.item(i),
                            id = this.note._id,
                            name = file.name,
                            mime = file.type,
                            size = file.size;

                        const blob = await FileUtil.uploadFile(file);
                        this.busy.progress = 20;
                        const processedBlob = await ImageUtil.processUploadImage(
                            blob,
                            mime
                        );
                        this.busy.progress = 50;
                        await Api.putAttachment(id, name, mime, processedBlob);
                        this.busy.progress = 80;
                        const content = "![" + name + "](note:" + name + ")";
                        this.insertOnCursor(content, editor);
                        this.busy.progress = 100;
                        this.busy.uploading = false;
                    }
                });
            }
            //this.refreshEditor();
        },
        refreshEditor() {
            if (this.editor && this.note) {
                this.editor.setValue(this.note.value);
                this.editor.refresh();
            }
        },
        removeEditor() {
            this.editor.toTextArea();
            this.editor = null;
        },
        update() {
            const note = {
                _id: this.note._id,
                title: this.note.title,
                value: this.editor.getValue()
            };
            this.$emit("updateNote", note);
        },
        insertOnCursor(content, editor) {
            const doc = editor.getDoc();
            const cursor = doc.getCursor();
            const line = doc.getLine(cursor.line);
            var pos = {
                line: cursor.line
            };
            if (line.length === 0) {
                doc.replaceRange(content, pos);
            } else {
                doc.replaceRange("\n" + content, pos);
            }
        }
    }
};
</script>
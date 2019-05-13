<template>
    <aside class="note-tree">
        <ActionAlert
            :show="action.show"
            :title="action.title"
            :content="action.content"
            :busy="action.busy"
            :result="action.result"
            :actionShow="action.actionShow"
            :actionContent="action.actionContent"
            @action="alertAction"
        />
        <input
            v-if="action.type === 'import' && action.show"
            type="file"
            class="import-file-dialog"
            ref="importFileDialog"
            @change="importCommitFile"
        >
        <NoteTreeToolbar
            @addNote="addNote"
            @changeNoteView="changeNoteView"
            @importAll="importAll"
            @exportAll="exportAll"
            @filter="filterAction"
        />
        <b-list-group class="note-tree-list">
            <b-list-group-item
                v-for="note in localNotes"
                class="note-tree-item flex-column align-items-start"
                :key="note._id"
                :active="openId === note._id"
                @click="openNote(note._id)"
            >
                <NoteTreeItem
                    :title="note.title"
                    :extra="note.created"
                    :excerpt="note.value"
                    @remove="removeNote(note._id, $event)"
                    @exportNote="exportNote(note._id, $event)"
                ></NoteTreeItem>
            </b-list-group-item>
        </b-list-group>
    </aside>
</template>

<script>
import Api from "@/api/Api";
import FileUtil from "@/utils/FileUtil";
import ActionAlert from "@/components/ActionAlert/ActionAlert";
import NoteTreeToolbar from "@/components/NoteTreeToolbar/NoteTreeToolbar";
import NoteTreeItem from "@/components/NoteTreeItem/NoteTreeItem";
import "./NoteTree.scss";

export default {
    name: "NoteTree",
    props: ["notes"],
    components: {
        ActionAlert,
        NoteTreeToolbar,
        NoteTreeItem
    },
    data() {
        return {
            openId: null,
            action: {
                title: "",
                content: "",
                show: false,
                busy: false,
                result: null,
                actionContent: "",
                actionShow: false
            },
            filter: {
                value: ""
            }
        };
    },
    computed: {
        defaultAction() {
            return {
                title: "",
                content: "",
                show: false,
                busy: false,
                result: null,
                actionContent: "",
                actionShow: false
            };
        },
        localNotes() {
            const filteredNotes = this.notes.filter(note => {
                return (
                    this.filter.value === null ||
                    this.filter.value === "" ||
                    note.title
                        .toLowerCase()
                        .includes(this.filter.value.toLowerCase())
                );
            });
            return filteredNotes;
        }
    },
    methods: {
        addNote() {
            this.$emit("addNote");
        },
        openNote(id) {
            this.openId = id;
            this.$emit("openNote", id);
        },
        removeNote(id, evt) {
            evt.preventDefault();
            evt.stopPropagation();
            if (this.openId === id) {
                this.openId = null;
            }
            this.$emit("removeNote", id);
        },
        _changeActionSheet(options) {
            Object.assign(this.action, options);
        },
        async exportNote(id, format) {
            this._changeActionSheet({
                type: "exportNote",
                show: true,
                title: "Exporting...",
                content: "Your note is getting prepared",
                busy: true
            });
            const blob = await Api.exportNote(id, format === "zip");
            this._changeActionSheet({
                content: "You note is ready to download",
                busy: false,
                actionShow: true,
                actionContent: "Download note",
                result: blob
            });
        },
        async exportAll() {
            this._changeActionSheet({
                type: "export",
                show: true,
                title: "Exporting...",
                content: "Your notes getting prepared",
                busy: true
            });
            const blob = await Api.exportAll();
            this._changeActionSheet({
                content: "Your notes are ready to download",
                busy: false,
                actionShow: true,
                actionContent: "Download notes",
                result: blob
            });
        },
        async importAll() {
            this._changeActionSheet({
                type: "import",
                show: true,
                title: "Import...",
                content: "Please choose a file to import",
                busy: false,
                result: null,
                actionShow: true,
                actionContent: "Choose import file"
            });
        },
        async importCommitFile(evt) {
            if (
                "target" in evt &&
                "files" in evt.target &&
                evt.target.files.length > 0
            ) {
                const importFile = evt.target.files[0];
                const importBlob = await FileUtil.uploadFile(importFile);
                this._changeActionSheet({
                    content: "Import notes...",
                    busy: true,
                    actionShow: false
                });
                await Api.importAll(importBlob);
                await this.$store.dispatch("initNotes");
                this.action = this.defaultAction;
            }
        },
        changeNoteView(viewMode) {
            this.$emit("changeNoteView", viewMode);
        },
        alertAction() {
            switch (this.action.type) {
                case "exportNote":
                case "export":
                    FileUtil.downloadBlob(this.action.result);
                    this.action.show = false;
                    this.action = this.defaultAction;
                    break;
                case "import":
                    this.$refs["importFileDialog"].click();
            }
        },
        filterAction(value) {
            this.filter.value = value;
        }
    }
};
</script>
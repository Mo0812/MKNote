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
        <NoteTreeToolbar
            @addNote="addNote"
            @changeNoteView="changeNoteView"
            @share="share"
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
import { filter } from "minimatch";

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
        changeNoteView(viewMode) {
            this.$emit("changeNoteView", viewMode);
        },
        async share(action) {
            switch (action) {
                case "export":
                    this.action = {
                        type: action,
                        show: true,
                        title: "Exporting...",
                        content: "Your files getting prepared",
                        busy: true
                    };
                    const blob = await Api.export();
                    this.action.content = "Your files are ready to download";
                    this.action.busy = false;
                    this.action.actionShow = true;
                    this.action.actionContent = "Download file";
                    this.action.result = blob;
                    break;
                case "import":
                    this.action = {
                        type: action,
                        show: true,
                        title: "Import...",
                        content: "Please choose a file to import",
                        busy: false,
                        result: null,
                        actionShow: true,
                        actionContent: "Choose import file"
                    };
            }
        },
        alertAction() {
            switch (this.action.type) {
                case "export":
                    FileUtil.downloadBlob(this.action.result);
                    this.action.show = false;
                    this.action = this.defaultAction;
                    break;
                case "import":
                    FileUtil.uploadDialog();
                    break;
            }
        },
        filterAction(value) {
            this.filter.value = value;
        }
    }
};
</script>
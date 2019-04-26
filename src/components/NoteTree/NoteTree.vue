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
        <!--<b-alert variant="primary" :show="action.show">
            <h5 class="alert-heading">{{action.title}}</h5>
            <hr>
            <p>{{action.content}}</p>
            <b-spinner v-if="action.busy" small label="Loading..." class="mx-auto mb-3 d-block"></b-spinner>
            <b-button
                v-if="action.result"
                class="mx-auto d-block"
                @click="download(action.result)"
            >Download file</b-button>
        </b-alert>-->
        <NoteTreeToolbar @addNote="addNote" @changeNoteView="changeNoteView" @share="share"/>
        <b-list-group class="note-tree-list">
            <b-list-group-item
                v-for="note in notes"
                class="note-tree-item flex-column align-items-start"
                :key="note._id"
                :active="openId === note._id"
                @click="openNote(note._id)"
            >
                <header class="d-flex w-100 justify-content-between">
                    <h5>{{note.title}}</h5>
                    <small>{{formatDate(note.created)}}</small>
                </header>
                <p class="excerpt mb-1">{{note.value}}</p>
                <footer>
                    <b-button variant="danger" size="sm" @click="removeNote(note._id, $event)">
                        <font-awesome-icon icon="trash"/>
                    </b-button>
                </footer>
            </b-list-group-item>
        </b-list-group>
    </aside>
</template>

<script>
import Api from "@/api/Api";
import FileUtil from "@/utils/FileUtil";
import ActionAlert from "@/components/ActionAlert/ActionAlert";
import NoteTreeToolbar from "@/components/NoteTreeToolbar/NoteTreeToolbar";
import "./NoteTree.scss";

export default {
    name: "NoteTree",
    props: ["notes"],
    components: {
        ActionAlert,
        NoteTreeToolbar
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
        formatDate(date) {
            return this.$moment(date)
                .startOf("minute")
                .fromNow();
        }
    }
};
</script>
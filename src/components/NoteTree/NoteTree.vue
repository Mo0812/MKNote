<template>
    <aside class="note-tree">
        <b-alert variant="primary" :show="action.show">
            <h5 class="alert-heading">{{action.title}}</h5>
            <hr>
            <p>{{action.content}}</p>
            <b-spinner v-if="action.busy" small label="Loading..." class="mx-auto mb-3 d-block"></b-spinner>
            <b-button
                v-if="action.result"
                class="mx-auto d-block"
                @click="download(action.result)"
            >Download file</b-button>
        </b-alert>
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
import NoteTreeToolbar from "@/components/NoteTreeToolbar/NoteTreeToolbar";
import "./NoteTree.scss";

export default {
    name: "NoteTree",
    props: ["notes"],
    components: {
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
                result: null
            }
        };
    },
    computed: {},
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
                        show: true,
                        title: "Exporting...",
                        content: "Your files getting prepared",
                        busy: true,
                        result: null
                    };
                    const blob = await Api.export();
                    this.action.content = "Your files are ready to download";
                    this.action.busy = false;
                    this.action.result = blob;
            }
        },
        download(blob) {
            FileUtil.downloadBlob(blob);
            this.action.show = false;
        },
        formatDate(date) {
            return this.$moment(date)
                .startOf("minute")
                .fromNow();
        }
    }
};
</script>
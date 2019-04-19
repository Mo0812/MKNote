<template>
    <aside class="note-tree">
        <NoteTreeToolbar @addNote="addNote" @changeNoteView="changeNoteView"/>
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
            openId: null
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
        formatDate(date) {
            return this.$moment(date)
                .startOf("minute")
                .fromNow();
        }
    }
};
</script>
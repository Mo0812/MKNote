<template>
    <aside class="note-tree">
        <NoteTreeToolbar @add="add" @changeNoteView="changeNoteView"/>
        <b-list-group class="note-tree-list">
            <b-list-group-item
                v-for="note in notes"
                class="note-tree-item flex-column align-items-start"
                :key="note.id"
                :active="openId === note.id"
                @click="openNote(note.id)"
            >
                <header class="d-flex w-100 justify-content-between">
                    <h5>{{note.title}}</h5>
                    <small>{{formatDate(note.created)}}</small>
                </header>
                <p class="excerpt mb-1">{{note.value}}</p>
                <footer>
                    <b-button variant="danger" size="sm" @click="removeNote(note.id)">Löschen</b-button>
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
        add() {
            this.$store.dispatch("addNote", {});
        },
        openNote(id) {
            this.openId = id;
            this.$emit("openNote", id);
        },
        removeNote(id) {
            this.$emit("removeNote", id);
        },
        changeNoteView(viewMode) {
            this.$emit("changeNoteView", viewMode);
        },
        formatDate(date) {
            return this.moment(date)
                .startOf("minute")
                .fromNow();
        }
    }
};
</script>
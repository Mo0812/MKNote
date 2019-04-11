<template>
    <aside class="note-tree">
        <NoteTreeToolbar @add="add" @changeView="changeView"/>
        <b-list-group class="note-tree-list">
            <b-list-group-item
                v-for="note in notes"
                class="note-tree-item flex-column align-items-start"
                :key="note.id"
                :active="noteIdOpen === note.id"
                @click="open(note.id)"
            >
                <header class="d-flex w-100 justify-content-between">
                    <h5>Title</h5>
                    <small>3 days ago</small>
                </header>
                <p class="excerpt mb-1">{{note.value}}</p>
                <footer>
                    <b-button variant="danger" size="sm" @click="remove(note.id)">Löschen</b-button>
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
    components: {
        NoteTreeToolbar
    },
    computed: {
        noteIdOpen() {
            return this.$store.getters.getNoteIdOpen;
        },
        notes() {
            return this.$store.getters.getNotes;
        }
    },
    methods: {
        add() {
            this.$store.dispatch("addNote", {});
        },
        open(id) {
            this.$store.dispatch("openNote", id);
        },
        remove(id) {
            this.$store.dispatch("removeNote", id);
        },
        changeView(checked) {
            this.$emit("changeView", checked);
        }
    }
};
</script>
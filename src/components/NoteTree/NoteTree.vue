<template>
    <aside class="note-tree">
        <NoteTreeToolbar @add="add"/>
        <b-list-group>
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
        }
    }
};
</script>
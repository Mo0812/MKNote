<template>
    <aside class="note-tree">
        <b-button @click="add">Add Note</b-button>
        <ul>
            <li v-for="note in notes" :key="note.id" @click="open(note.id)">{{note}}</li>
        </ul>
    </aside>
</template>

<script>
export default {
    name: "NoteTree",
    computed: {
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
<template>
    <aside class="note-tree">
        <b-button @click="test">Add Note</b-button>
        <ul>
            <li v-for="note in notes" :key="note.id" @click="remove(note.id)">{{note}}</li>
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
        test() {
            this.$store.dispatch("addNote", {});
        },
        remove(id) {
            this.$store.dispatch("removeNote", id);
        }
    }
};
</script>
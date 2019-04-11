<template>
    <b-button-toolbar key-nav aria-label="Toolbar for managing notes">
        <b-button-group size="sm">
            <b-button @click="add">Add</b-button>
        </b-button-group>
    </b-button-toolbar>
</template>

<script>
export default {
    name: "NoteTreeToolbar",
    methods: {
        add() {
            this.$emit("add");
        }
    }
};
</script>

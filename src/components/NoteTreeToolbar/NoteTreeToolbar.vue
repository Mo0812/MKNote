<template>
    <b-button-toolbar
        class="note-tree-toolbar mt-3 pb-3"
        key-nav
        aria-label="Toolbar for managing notes"
    >
        <b-button-group size="sm">
            <b-button @click="add">Add</b-button>
        </b-button-group>

        <b-button-group>
            <b-form-radio-group
                id="btn-radios-1"
                v-model="view.selected"
                :options="view.options"
                buttons
                size="sm"
                name="radios-btn-default"
                @change="change"
            ></b-form-radio-group>
        </b-button-group>
    </b-button-toolbar>
</template>

<script>
import "./NoteTreeToolbar.scss";

export default {
    name: "NoteTreeToolbar",
    data() {
        return {
            view: {
                selected: "both",
                options: [
                    { text: "Md", value: "md" },
                    { text: "Prev", value: "preview" },
                    { text: "Both", value: "both" }
                ]
            }
        };
    },
    methods: {
        add() {
            this.$emit("add");
        },
        change(value) {
            this.$emit("changeNoteView", value);
        }
    }
};
</script>

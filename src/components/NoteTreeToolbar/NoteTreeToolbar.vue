<template>
    <b-button-toolbar
        class="note-tree-toolbar mt-3 pb-3"
        key-nav
        aria-label="Toolbar for managing notes"
    >
        <b-button-group size="sm">
            <b-button @click="add">Add</b-button>
        </b-button-group>

        <b-button-group size="sm">
            <b-form-radio-group
                id="btn-radios-1"
                v-model="viewSelected"
                :options="view.options"
                buttons
                name="radios-btn-default"
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
                options: [
                    { text: "Md", value: "md" },
                    { text: "Prev", value: "preview" },
                    { text: "Both", value: "both" }
                ]
            }
        };
    },
    computed: {
        viewSelected: {
            get() {
                const noteView = this.$store.getters.getNoteView;
                return noteView.viewMode;
            },
            set(value) {
                this.$store.dispatch("changeNoteView", value);
            }
        }
    },
    methods: {
        add() {
            this.$emit("add");
        }
    }
};
</script>

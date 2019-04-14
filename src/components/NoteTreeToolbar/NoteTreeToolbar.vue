<template>
    <b-button-toolbar
        class="note-tree-toolbar mt-3 pb-3 mr-3"
        key-nav
        aria-label="Toolbar for managing notes"
        :justify="true"
    >
        <b-button-group size="sm">
            <b-button aria-label="Add new Note" @click="add">
                <font-awesome-icon icon="plus"/>
            </b-button>
        </b-button-group>

        <b-button-group size="sm">
            <b-button
                v-for="option in view.options"
                :key="option.value"
                :aria-label="option.label"
                :active="option.value === view.selected"
                @click="changeNoteView(option.value)"
            >
                <font-awesome-icon :icon="option.icon"/>
            </b-button>
        </b-button-group>

        <b-button-group size="sm">
            <b-button
                v-for="option in view.options"
                :key="option.value"
                :aria-label="option.label"
                :active="option.value === view.selected"
                @click="changeNoteView(option.value)"
            >
                <font-awesome-icon :icon="option.icon"/>
            </b-button>
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
                    {
                        icon: "code",
                        label: "Only Markdown Editor",
                        value: "md"
                    },
                    { icon: "eye", label: "Only Preview", value: "preview" },
                    {
                        icon: "book-open",
                        label: "Markdown Editor and Preview",
                        value: "both"
                    }
                ]
            }
        };
    },
    methods: {
        add() {
            this.$emit("add");
        },
        changeNoteView(value) {
            this.$emit("changeNoteView", value);
        }
    }
};
</script>

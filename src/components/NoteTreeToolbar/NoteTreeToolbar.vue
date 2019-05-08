<template>
    <div class="note-tree-toolbar">
        <b-button-toolbar
            class="note-tree-button-bar px-3 my-2"
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
                    v-for="option in share.options"
                    :key="option.value"
                    :aria-label="option.label"
                    :disabled="option.value === 'import'"
                    @click="shareAction(option.value)"
                >
                    <font-awesome-icon :icon="option.icon"/>
                </b-button>
            </b-button-group>
        </b-button-toolbar>
        <b-input-group class="note-tree-filter-group">
            <b-input
                class="note-tree-filter-input"
                placeholder="Filter notes"
                v-model="filter.value"
                @input="inputFilterValue"
            />
        </b-input-group>
    </div>
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
            },
            share: {
                options: [
                    {
                        icon: "file-import",
                        label: "Import notes",
                        value: "import"
                    },
                    {
                        icon: "file-export",
                        label: "Export notes",
                        value: "export"
                    }
                ]
            },
            filter: {
                value: ""
            }
        };
    },
    methods: {
        add() {
            this.$emit("addNote");
        },
        changeNoteView(value) {
            this.$emit("changeNoteView", value);
        },
        shareAction(action) {
            this.$emit("share", action);
        },
        inputFilterValue(action) {
            this.$emit("filter", this.filter.value);
        }
    }
};
</script>

<template>
    <b-row class="h-100">
        <b-col cols="4" class="h-100 pr-0">
            <NoteTree @open="open" @remove="remove" @changeNoteView="changeNoteView"/>
        </b-col>
        <template v-if="viewMode === 'both'">
            <b-col cols="4" class="px-0">
                <NoteEditor :note="note" @update="update"/>
            </b-col>
            <b-col cols="4">
                <NotePreview :note="note"/>
            </b-col>
        </template>
        <template v-else-if="viewMode === 'md'">
            <b-col cols="8" class="px-0">
                <NoteEditor :note="note" @update="update"/>
            </b-col>
        </template>
        <template v-else>
            <b-col cols="4">
                <NotePreview :note="note"/>
            </b-col>
        </template>
    </b-row>
</template>

<script>
import NoteEditor from "@/components/NoteEditor/NoteEditor";
import NotePreview from "@/components/NotePreview/NotePreview";
import NoteTree from "@/components/NoteTree/NoteTree";

export default {
    name: "NoteView",
    components: {
        NoteEditor,
        NotePreview,
        NoteTree
    },
    data() {
        return {
            note: null,
            viewMode: "both"
        };
    },
    computed: {
        view() {
            const noteView = this.$store.getters.getNoteView;
            return noteView.viewMode;
        },
        notes() {
            return this.$store.getters.getNotes;
        }
    },
    methods: {
        open(id) {
            const note = this.notes.find(element => element.id === id);
            this.note = note;
        },
        update(updatedNote) {
            this.$store.dispatch("updateNote", updatedNote);
        },
        remove(id) {
            this.$store.dispatch("removeNote", id);
        },
        changeNoteView(viewMode) {
            this.viewMode = viewMode;
        }
    }
};
</script>

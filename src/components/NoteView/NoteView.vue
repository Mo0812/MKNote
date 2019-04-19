<template>
    <b-row class="h-100">
        <b-col cols="4" class="h-100 pr-0">
            <NoteTree
                :notes="notes"
                @addNote="addNote"
                @openNote="openNote"
                @removeNote="removeNote"
                @changeNoteView="changeNoteView"
            />
        </b-col>
        <template v-if="viewMode === 'both'">
            <b-col cols="4" class="px-0">
                <NoteEditor :note="note" @updateNote="updateNote"/>
            </b-col>
            <b-col cols="4">
                <NotePreview :note="note"/>
            </b-col>
        </template>
        <template v-else-if="viewMode === 'md'">
            <b-col cols="8" class="px-0">
                <NoteEditor :note="note" @updateNote="updateNote"/>
            </b-col>
        </template>
        <template v-else>
            <b-col cols="8">
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
        notes() {
            return this.$store.getters.getNotes;
        }
    },
    created() {
        this.$store.dispatch("initNotes");
    },
    methods: {
        addNote() {
            this.$store.dispatch("addNote", {});
        },
        openNote(id) {
            const note = this.notes.find(element => element._id === id);
            this.note = note;
        },
        updateNote(updatedNote) {
            this.$store.dispatch("updateNote", updatedNote);
        },
        async removeNote(id) {
            await this.$store.dispatch("removeNote", id);
            this.note = null;
        },
        changeNoteView(viewMode) {
            this.viewMode = viewMode;
        }
    }
};
</script>

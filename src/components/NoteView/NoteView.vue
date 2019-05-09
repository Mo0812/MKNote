<template>
    <b-row class="note-view">
        <b-col cols="4" xl="3" class="note-tree-col px-0">
            <NoteTree
                :notes="notes"
                @addNote="addNote"
                @openNote="openNote"
                @removeNote="removeNote"
                @changeNoteView="changeNoteView"
            />
        </b-col>
        <template v-if="viewMode === 'both'">
            <b-col cols="8" xl="5" class="note-editor-col px-0">
                <NoteEditor :note="note" @updateNote="updateNote"/>
            </b-col>
            <b-col cols="4" class="note-preview-col d-none d-xl-block">
                <NotePreview :note="note"/>
            </b-col>
        </template>
        <template v-else-if="viewMode === 'md'">
            <b-col cols="8" xl="9" class="px-0">
                <NoteEditor :note="note" @updateNote="updateNote"/>
            </b-col>
        </template>
        <template v-else>
            <b-col cols="8" xl="9">
                <NotePreview :note="note"/>
            </b-col>
        </template>
    </b-row>
</template>

<script>
import NoteEditor from "@/components/NoteEditor/NoteEditor";
import NotePreview from "@/components/NotePreview/NotePreview";
import NoteTree from "@/components/NoteTree/NoteTree";

import "./NoteView.scss";

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
        this.$store.dispatch("initNotes").catch(error => {
            console.log(error);
        });
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

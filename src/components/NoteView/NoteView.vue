<template>
    <b-row class="h-100">
        <b-col cols="4" class="h-100 pr-0">
            <NoteTree/>
        </b-col>
        <template v-if="view === 'both'">
            <b-col cols="4" class="px-0">
                <NoteEditor/>
            </b-col>
            <b-col cols="4">
                <NotePreview/>
            </b-col>
        </template>
        <template v-else-if="view === 'md'">
            <b-col cols="8" class="px-0">
                <NoteEditor/>
            </b-col>
        </template>
        <template v-else>
            <b-col cols="4">
                <NotePreview/>
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
    computed: {
        view() {
            const noteView = this.$store.getters.getNoteView;
            return noteView.viewMode;
        }
    }
};
</script>

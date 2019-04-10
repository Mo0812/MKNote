<template>
    <b-container class="note-view" fluid>
        <b-row>
            <b-col cols="2">
                <NoteTree/>
            </b-col>
            <b-col cols="5">
                <NoteEditor/>
            </b-col>
            <b-col cols="5">
                <NotePreview/>
            </b-col>
        </b-row>
    </b-container>
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
    }
};
</script>

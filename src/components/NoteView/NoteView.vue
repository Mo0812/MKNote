<template>
    <b-row class="h-100">
        <b-col cols="2" class="h-100 pr-0">
            <NoteTree/>
        </b-col>
        <b-col cols="5" class="pl-0">
            <NoteEditor/>
        </b-col>
        <b-col cols="5">
            <NotePreview/>
        </b-col>
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
    }
};
</script>

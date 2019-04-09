<template>
    <main>
        <NoteView/>
    </main>
</template>

<script>
// @ is an alias to /src
import NoteView from "@/components/NoteView/NoteView";

export default {
    name: "note",
    components: {
        NoteView
    }
};
</script>

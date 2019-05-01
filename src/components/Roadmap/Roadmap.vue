<template>
    <section class="roadmap">
        <h3 class="text-center">Roadmap</h3>
        <!-- https://github.com/Mo0812/MKNote/blob/master/ROADMAP.md -->
        <div class="content" v-html="content"/>
    </section>
</template>

<script>
import MarkdownUtil from "@/utils/MarkdownUtil";

export default {
    name: "Roadmap",
    data() {
        return {
            content: null
        };
    },
    created() {
        this.fetch();
    },
    methods: {
        async fetch() {
            const response = await fetch(
                "https://raw.githubusercontent.com/Mo0812/MKNote/master/ROADMAP.md"
            );
            if (response.ok) {
                const content = await response.text();
                const processedContent = MarkdownUtil.processMarkdown(
                    MarkdownUtil.removeElement(
                        content,
                        MarkdownUtil.elements.HEADING
                    )
                );
                this.content = processedContent;
            }
        }
    }
};
</script>

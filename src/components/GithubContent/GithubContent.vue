<template>
    <section class="github-content">
        <h3 v-if="title" class="text-center">{{title}}</h3>
        <!-- https://github.com/Mo0812/MKNote/blob/master/ROADMAP.md -->
        <div class="content" v-html="content"/>
    </section>
</template>

<script>
import MarkdownUtil from "@/utils/MarkdownUtil";

export default {
    name: "GithubContent",
    props: ["title", "url", "process"],
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
            if (this.url) {
                const response = await fetch(this.url);
                if (response.ok) {
                    const content = await response.text();
                    const cleanedContent =
                        this.process === true
                            ? MarkdownUtil.removeElement(
                                  content,
                                  MarkdownUtil.elements.HEADING
                              )
                            : content;
                    const processedContent = MarkdownUtil.processMarkdown(
                        cleanedContent
                    );
                    this.content = processedContent;
                }
            }
        }
    }
};
</script>

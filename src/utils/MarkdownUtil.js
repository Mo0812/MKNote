import showdown from "showdown";

showdown.setFlavor("github");
showdown.setOption("emoji", true);
showdown.setOption("tasklists", true);
showdown.setOption("smoothLivePreview", true);
showdown.setOption("ghCodeBlocks", true);
showdown.setOption("tables", true);
showdown.setOption("strikethrough", true);
export default {
    elements: {
        HEADING: "^#{1,6}(.)*"
    },
    converter: new showdown.Converter(),
    processMarkdown(markdown) {
        return this.converter.makeHtml(markdown);
    },
    removeElement(markdown, element) {
        return markdown.replace(new RegExp(element), "");
    }
};

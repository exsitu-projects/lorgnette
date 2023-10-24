import { Language } from "../../../core/languages/Language";
import { MarkdownParser } from "./MarkdownParser";

export const MARKDOWN_LANGUAGE: Language = {
    name: "Markdown",
    id: "markdown",
    codeEditorLanguageId: "markdown",
    parser: new MarkdownParser()
};
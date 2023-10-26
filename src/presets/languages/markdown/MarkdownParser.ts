// import { Parser as CommonmarkParser } from "commonmark";
import { fromMarkdown } from "mdast-util-from-markdown";
import { gfm } from "micromark-extension-gfm";
import { gfmFromMarkdown } from "mdast-util-gfm";
import { Parser } from "../../../core/languages/Parser";
import { MarkdownSyntaxTree } from "./MarkdownSyntaxTree";
import { Document } from "../../../core/documents/Document";

export interface MarkdownParserContext {
    text: string;
    sourceDocument: Document;
}

export class MarkdownParser implements Parser {
    async parse(document: Document): Promise<MarkdownSyntaxTree> {
        const text = document.content;
        const rootNode = fromMarkdown(text, {
            extensions: [gfm()],
            mdastExtensions: [gfmFromMarkdown()]
        });

        return MarkdownSyntaxTree.fromMarkdownTreeRootNode(rootNode, {
            text: text,
            sourceDocument: document
        });
    }
}

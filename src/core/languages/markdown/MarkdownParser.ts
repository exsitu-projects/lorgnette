// import { Parser as CommonmarkParser } from "commonmark";
import { fromMarkdown } from "mdast-util-from-markdown";
import { gfm } from "micromark-extension-gfm";
import { gfmFromMarkdown } from "mdast-util-gfm";
import { Parser } from "../Parser";
import { MarkdownSyntaxTree } from "./MarkdownSyntaxTree";

export interface MarkdownParserContext {
    text: string;
};

export class MarkdownParser implements Parser {
    async parse(text: string): Promise<MarkdownSyntaxTree> {
        const rootNode = fromMarkdown(text, {
            extensions: [gfm()],
            mdastExtensions: [gfmFromMarkdown()]
        });

        console.log("root", rootNode)
        
        return MarkdownSyntaxTree.fromMarkdownTreeRootNode(rootNode, { text: text });
    }
}

import * as csstree from "css-tree";
import { Document } from "../../../core/documents/Document";
import { Parser } from "../../../core/languages/Parser";
import { CssSyntaxTree } from "./CssSyntaxTree";

export interface CssParserContext {
    text: string;
    sourceDocument: Document;
};

export class CssParser implements Parser {
    async parse(document: Document): Promise<CssSyntaxTree> {
        const text = document.content;
        const parsingContext = {
            text: text,
            sourceDocument: document
        };

        const rootCssTreeNode = csstree.parse(text, {
            parseValue: false,
            positions: true
        });
        
        return CssSyntaxTree.fromCssTreeRootNode(rootCssTreeNode, parsingContext);
    }
}
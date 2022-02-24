import * as csstree from "css-tree";
import { Parser } from "../Parser";
import { CssSyntaxTree } from "./CssSyntaxTree";

export interface CssParserContext {
    text: string;
};

export class CssParser implements Parser {
    parse(text: string): CssSyntaxTree {
        const parsingContext = {
            text: text
        };

        const rootCssTreeNode = csstree.parse(text, {
            parseValue: false,
            positions: true
        });
        
        return CssSyntaxTree.fromCssTreeRootNode(rootCssTreeNode, parsingContext);
    }
}
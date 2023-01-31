import { SyntaxTree } from "../SyntaxTree";
import { CssSyntaxTreeNode } from "./CssSyntaxTreeNode";
import { CssParserContext } from "./CssParser";
import { CssNode } from "css-tree";

export class CssSyntaxTree extends SyntaxTree<CssSyntaxTreeNode> {
    static fromCssTreeRootNode(parserNode: CssNode, parserContext: CssParserContext): CssSyntaxTree {
        const rootNode = CssSyntaxTreeNode.fromCssTreeNode(parserNode, parserContext);
        return new CssSyntaxTree(rootNode);
    } 
}


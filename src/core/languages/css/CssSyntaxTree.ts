import { SyntaxTree } from "../SyntaxTree";
import { CssSyntaxTreeNode } from "./CssSyntaxTreeNode";
import { CssParserContext } from "./CssParser";
import { CssNode } from "css-tree";

export class CssSyntaxTree extends SyntaxTree<CssSyntaxTreeNode> {
    readonly root: CssSyntaxTreeNode;

    constructor(root: CssSyntaxTreeNode) {
        super();
        this.root = root;
    }

    static fromCssTreeRootNode(parserNode: CssNode, parserContext: CssParserContext): CssSyntaxTree {
        const rootNode = CssSyntaxTreeNode.fromCssTreeNode(parserNode, parserContext);
        return new CssSyntaxTree(rootNode);
    } 
}


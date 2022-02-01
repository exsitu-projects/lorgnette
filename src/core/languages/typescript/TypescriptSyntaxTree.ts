import { SyntaxTree } from "../SyntaxTree";
import { ts } from "ts-morph";
import { TypescriptSyntaxTreeNode } from "./TypescriptSyntaxTreeNode";
import { TypescriptParserContext } from "./TypescriptParser";

export class TypescriptSyntaxTree extends SyntaxTree<TypescriptSyntaxTreeNode> {
    readonly root: TypescriptSyntaxTreeNode;

    constructor(root: TypescriptSyntaxTreeNode) {
        super();
        this.root = root;
    }

    static fromTsMorphNode(parserNode: ts.Node, parserContext: TypescriptParserContext): TypescriptSyntaxTree {
        const rootNode = TypescriptSyntaxTreeNode.fromTsMorphNode(parserNode, parserContext);
        return new TypescriptSyntaxTree(rootNode);
    } 
}


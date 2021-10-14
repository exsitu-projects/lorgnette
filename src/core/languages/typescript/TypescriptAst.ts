import { Ast } from "../Ast";
import { MathParserContext } from "../math/MathParser";
import { ts } from "ts-morph";
import { TypescriptAstNode } from "./TypescriptAstNode";

export class TypescriptAst extends Ast<TypescriptAstNode> {
    readonly root: TypescriptAstNode;

    constructor(root: TypescriptAstNode) {
        super();
        this.root = root;
    }

    static fromTsMorphNode(parserNode: ts.Node, parserContext: MathParserContext): TypescriptAst {
        const rootNode = TypescriptAstNode.fromTsMorphNode(parserNode, parserContext);
        return new TypescriptAst(rootNode);
    } 
}


import { Ast } from "../Ast";
import { MathAstNode } from "./MathAstNode";
import { MathParserContext } from "./MathParser";
import { AdditionNode } from "./nodes/AdditionNode";
import { ConstantNode } from "./nodes/ConstantNode";
import { DivisionNode } from "./nodes/DivisionNode";
import { ExponentNode } from "./nodes/ExponentNode";
import { ExpressionNode } from "./nodes/ExpressionNode";
import { FunctionNode } from "./nodes/FunctionNode";
import { MultiplicationNode } from "./nodes/MultiplicationNode";
import { NumberNode } from "./nodes/NumberNode";
import { ParenthesesNode } from "./nodes/ParanthesesNode";
import { SubstractionNode } from "./nodes/SubstractionNode";

export function convertParserNode(
    parserNode: any,
    parserContext: MathParserContext
): MathAstNode {
    const nodeClasses = [
        ExpressionNode,
        ParenthesesNode,
        ExponentNode,
        MultiplicationNode,
        DivisionNode,
        AdditionNode,
        SubstractionNode,
        FunctionNode,
        ConstantNode,
        NumberNode
    ];

    if (!parserNode || !parserNode.type) debugger

    const parserNodeType = parserNode.type;
    const nodeClass = nodeClasses.find(nodeClass => nodeClass.type === parserNodeType);
    if (!nodeClass) {
        throw new Error(`Unknown math. AST node type: ${parserNodeType}`);
    }

    return nodeClass.fromNearlyParserResultNode(parserNode, parserContext);;
}

export class MathAst extends Ast<MathAstNode> {
    readonly root: MathAstNode;

    constructor(root: MathAstNode) {
        super();
        this.root = root;
    }

    static fromNearlyParserResult(result: any, parserContext: MathParserContext): MathAst {
        const rootNode = convertParserNode(result, parserContext);
        return new MathAst(rootNode);
    } 
}


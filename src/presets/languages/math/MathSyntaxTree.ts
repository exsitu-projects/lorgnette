import { SyntaxTree } from "../../../core/languages/SyntaxTree";
import { MathSyntaxTreeNode } from "./MathSyntaxTreeNode";
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
import { WhitespaceNode } from "./nodes/WhitespaceNode";

export function convertParserNode(
    parserNode: any,
    parserContext: MathParserContext
): MathSyntaxTreeNode {
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
        NumberNode,
        WhitespaceNode
    ];

    if (!parserNode || !parserNode.type) debugger

    const parserNodeType = parserNode.type;
    const nodeClass = nodeClasses.find(nodeClass => nodeClass.type === parserNodeType);
    if (!nodeClass) {
        throw new Error(`Unknown math. syntax tree node type: ${parserNodeType}`);
    }

    return nodeClass.fromNearlyParserResultNode(parserNode, parserContext);;
}

export class MathSyntaxTree extends SyntaxTree<MathSyntaxTreeNode> {
    static fromNearlyParserResult(result: any, parserContext: MathParserContext): MathSyntaxTree {
        const rootNode = convertParserNode(result, parserContext);
        return new MathSyntaxTree(rootNode);
    } 
}


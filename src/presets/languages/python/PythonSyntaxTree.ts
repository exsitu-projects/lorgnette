import { SyntaxTree } from "../../../core/languages/SyntaxTree";
import { PythonSyntaxTreeNode } from "./PythonSyntaxTreeNode";
import { PythonParserContext } from "./PythonParser";
import { FunctionCallNode } from "./nodes/FunctionCallNode";
import { ExpressionNode } from "./nodes/ExpressionNode";
import { StringNode } from "./nodes/StringNode";
import { BooleanNode } from "./nodes/BooleanNode";
import { NoneNode } from "./nodes/NoneNode";
import { NamedAccessNode } from "./nodes/NamedAccessNode";
import { IndexedAccessNode } from "./nodes/IndexedAccessNode";
import { ProgramNode } from "./nodes/ProgramNode";
import { ArgumentListNode } from "./nodes/ArgumentListNode";
import { PositionalArgumentNode } from "./nodes/PositionalArgumentNode";
import { NamedArgumentNode } from "./nodes/NamedArgumentNode";
import { IdentifierNode } from "./nodes/IdentifierNode";
import { Document } from "../../../core/documents/Document";
import { NumberNode } from "./nodes/NumberNode";

export const PYTHON_NODE_CLASSES = [
    ProgramNode,
    ExpressionNode,
    IdentifierNode,
    NamedAccessNode,
    IndexedAccessNode,
    FunctionCallNode,
    ArgumentListNode,
    PositionalArgumentNode,
    NamedArgumentNode,
    StringNode,
    NumberNode,
    BooleanNode,
    NoneNode
] as const;

export function convertParserNode(
    parserNode: any,
    parserContext: PythonParserContext
) {
    const parserNodeType = parserNode.type;
    const nodeClass = PYTHON_NODE_CLASSES.find(nodeClass => nodeClass.type === parserNodeType);
    if (!nodeClass) {
        throw new Error(`Unknown Python syntax tree node type: ${parserNodeType}`);
    }

    return nodeClass.fromNearlyParserResultNode(parserNode, parserContext);
}

export class PythonSyntaxTree extends SyntaxTree<PythonSyntaxTreeNode> {
    static fromNearlyParserResult(result: any, parserContext: PythonParserContext): PythonSyntaxTree {
        const rootNode = ProgramNode.fromNearlyParserResultNode(result, parserContext);
        return new PythonSyntaxTree(rootNode);
    } 
}


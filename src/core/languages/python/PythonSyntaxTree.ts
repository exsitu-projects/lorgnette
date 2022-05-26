import { SyntaxTree } from "../SyntaxTree";
import { PythonSyntaxTreeNode } from "./PythonSyntaxTreeNode";
import { PythonParserContext } from "./PythonParser";
import { FunctionCallNode } from "./nodes/FunctionCallNode";
import { ExpressionNode } from "./nodes/ExpressionNode";
import { StringNode } from "./nodes/StringNode";
import { NumberNode } from "../math/nodes/NumberNode";
import { BooleanNode } from "./nodes/BooleanNode";
import { NoneNode } from "./nodes/NoneNode";
import { NamedAccessNode } from "./nodes/NamedAccessNode";
import { IndexedAccessNode } from "./nodes/IndexedAccessNode";
import { ProgramNode } from "./nodes/ProgramNode";
import { ArgumentListNode } from "./nodes/ArgumentListNode";
import { PositionalArgumentNode } from "./nodes/PositionalArgumentNode";
import { NamedArgumentNode } from "./nodes/NamedArgumentNode";

export const PYTHON_NODE_CLASSES = [
    ProgramNode,
    ExpressionNode,
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

// export type PythonNodes =
//     | ProgramNode
//     | ExpressionNode
//     | NamedAccessNode
//     | IndexedAccessNode
//     | FunctionCallNode
//     | ArgumentListNode
//     | ArgumentNode
//     | NamedArgumentNode
//     | ArrayNode
//     | StringNode
//     | NumberNode
//     | BooleanNode
//     | NoneNode;

// export type PythonNodeClasses = ClassOf<PythonNodes>;

// export function makeParserNodeConverter<
//     T extends PythonNodeClasses
// >(nodeClasses: T[]): 

export function convertParserNode(
    parserNode: any,
    parserContext: PythonParserContext
): PythonSyntaxTreeNode {
    const parserNodeType = parserNode.type;
    const nodeClass = PYTHON_NODE_CLASSES.find(nodeClass => nodeClass.type === parserNodeType);
    if (!nodeClass) {
        throw new Error(`Unknown Python syntax tree node type: ${parserNodeType}`);
    }

    return nodeClass.fromNearlyParserResultNode(parserNode, parserContext);
}

export class PythonSyntaxTree extends SyntaxTree<PythonSyntaxTreeNode> {
    readonly root: PythonSyntaxTreeNode;

    constructor(root: PythonSyntaxTreeNode) {
        super();
        this.root = root;
    }

    static fromNearlyParserResult(result: any, parserContext: PythonParserContext): PythonSyntaxTree {
        const rootNode = convertParserNode(result, parserContext);
        return new PythonSyntaxTree(rootNode);
    } 
}


import { SyntaxTree } from "../SyntaxTree";
import { JsonSyntaxTreeNode } from "./JsonSyntaxTreeNode";
import { JsonParserContext } from "./JsonParser";
import { ObjectNode } from "./nodes/ObjectNode";
import { PropertyNode } from "./nodes/PropertyNode";
import { ArrayNode } from "./nodes/ArrayNode";
import { StringNode } from "./nodes/StringNode";
import { NumberNode } from "./nodes/NumberNode";
import { BooleanNode } from "./nodes/BooleanNode";
import { NullNode } from "./nodes/NullNode";
import { KeyNode } from "./nodes/KeyNode";

export function convertParserNode(
    parserNode: any,
    parserContext: JsonParserContext
): JsonSyntaxTreeNode {
    const nodeClasses = [
        ObjectNode,
        PropertyNode,
        KeyNode,
        ArrayNode,
        StringNode,
        NumberNode,
        BooleanNode,
        NullNode
    ];

    const parserNodeType = parserNode.type;
    const nodeClass = nodeClasses.find(nodeClass => nodeClass.type === parserNodeType);
    if (!nodeClass) {
        throw new Error(`Unknown JSON syntax tree node type: ${parserNodeType}`);
    }

    return nodeClass.fromNearlyParserResultNode(parserNode, parserContext);
}

export class JsonSyntaxTree extends SyntaxTree<JsonSyntaxTreeNode> {
    readonly root: JsonSyntaxTreeNode;

    constructor(root: JsonSyntaxTreeNode) {
        super();
        this.root = root;
    }

    static fromNearlyParserResult(result: any, parserContext: JsonParserContext): JsonSyntaxTree {
        const rootNode = convertParserNode(result[0], parserContext);
        return new JsonSyntaxTree(rootNode);
    } 
}


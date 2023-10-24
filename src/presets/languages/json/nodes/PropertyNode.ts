import { Range } from "../../../../core/documents/Range";
import { JsonSyntaxTreeNode } from "../JsonSyntaxTreeNode";
import { JsonParserContext } from "../JsonParser";
import { ObjectNode } from "./ObjectNode";
import { ArrayNode } from "./ArrayNode";
import { BooleanNode } from "./BooleanNode";
import { NullNode } from "./NullNode";
import { NumberNode } from "./NumberNode";
import { StringNode } from "./StringNode";
import { KeyNode } from "./KeyNode";
import { convertParserNode } from "../JsonSyntaxTree";
import { Document } from "../../../../core/documents/Document";

export type ValueNode =
    | ObjectNode
    | ArrayNode
    | StringNode
    | NumberNode
    | BooleanNode
    | NullNode;

export class PropertyNode extends JsonSyntaxTreeNode {
    static readonly type = "Property";
    readonly type = PropertyNode.type;

    readonly key: KeyNode;
    readonly value: ValueNode;

    constructor(
        key: KeyNode,
        value: ValueNode,
        parserNode: any,
        range: Range,
        sourceDocument: Document
    ) {
        super(parserNode, range, sourceDocument);
        this.key = key;
        this.value = value;
    }

    get childNodes(): JsonSyntaxTreeNode[] {
        return [this.key, this.value];
    }

    static fromNearlyParserResultNode(node: any, parserContext: JsonParserContext): JsonSyntaxTreeNode {
        return new PropertyNode(
            convertParserNode(node.key, parserContext) as KeyNode,
            convertParserNode(node.value, parserContext) as ValueNode,
            node,
            PropertyNode.computeRangeFromParserNode(node, parserContext),
            parserContext.sourceDocument
        );
    }
}
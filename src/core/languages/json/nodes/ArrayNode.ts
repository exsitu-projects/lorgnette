import { Range } from "../../../documents/Range";
import { JsonSyntaxTreeNode } from "../JsonSyntaxTreeNode";
import { JsonParserContext } from "../JsonParser";
import { ObjectNode } from "./ObjectNode";
import { BooleanNode } from "./BooleanNode";
import { NullNode } from "./NullNode";
import { NumberNode } from "./NumberNode";
import { StringNode } from "./StringNode";
import { convertParserNode } from "../JsonSyntaxTree";

export type ValueNode =
    | ObjectNode
    | ArrayNode
    | StringNode
    | NumberNode
    | BooleanNode
    | NullNode;

export class ArrayNode extends JsonSyntaxTreeNode {
    static readonly type = "Array";
    readonly type = ArrayNode.type;

    readonly values: ValueNode[];

    constructor(values: ValueNode[], parserNode: any, range: Range) {
        super(parserNode, range);
        this.values = values;
    }

    get childNodes(): JsonSyntaxTreeNode[] {
        return [...this.values];
    }

    static fromNearlyParserResultNode(node: any, parserContext: JsonParserContext): JsonSyntaxTreeNode {
        return new ArrayNode(
            node.values.map((n: any) => convertParserNode(n, parserContext)),
            node,
            ArrayNode.computeRangeFromParserNode(node, parserContext)
        );
    }
}
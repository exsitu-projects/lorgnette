import { Range } from "../../../documents/Range";
import { JsonSyntaxTreeNode } from "../JsonSyntaxTreeNode";
import { JsonParserContext } from "../JsonParser";

export class NumberNode extends JsonSyntaxTreeNode {
    static readonly type = "Number";
    readonly type = NumberNode.type;

    readonly value: number;

    constructor(value: number, parserNode: any, range: Range) {
        super(parserNode, range);
        this.value = value;
    }

    get childNodes(): JsonSyntaxTreeNode[] {
        return [];
    }

    static fromNearlyParserResultNode(node: any, parserContext: JsonParserContext): JsonSyntaxTreeNode {
        return new NumberNode(
            Number(node.value.text),
            node,
            NumberNode.computeRangeFromParserNode(node, parserContext)
        );
    }
}
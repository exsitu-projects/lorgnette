import { Range } from "../../../documents/Range";
import { JsonSyntaxTreeNode } from "../JsonSyntaxTreeNode";
import { JsonParserContext } from "../JsonParser";

export class BooleanNode extends JsonSyntaxTreeNode {
    static readonly type = "Boolean";
    readonly type = BooleanNode.type;

    readonly value: boolean;

    constructor(value: boolean, parserNode: any, range: Range) {
        super(parserNode, range);
        this.value = value;
    }

    get childNodes(): JsonSyntaxTreeNode[] {
        return [];
    }

    static fromNearlyParserResultNode(node: any, parserContext: JsonParserContext): JsonSyntaxTreeNode {
        return new BooleanNode(
            node.value,
            node,
            BooleanNode.computeRangeFromParserNode(node, parserContext)
        );
    }
}
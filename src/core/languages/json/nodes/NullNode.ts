import { Range } from "../../../documents/Range";
import { JsonSyntaxTreeNode } from "../JsonSyntaxTreeNode";
import { JsonParserContext } from "../JsonParser";

export class NullNode extends JsonSyntaxTreeNode {
    static readonly type = "Null";
    readonly type = NullNode.type;

    get childNodes(): JsonSyntaxTreeNode[] {
        return [];
    }

    static fromNearlyParserResultNode(node: any, parserContext: JsonParserContext): JsonSyntaxTreeNode {
        return new NullNode(
            node,
            NullNode.computeRangeFromParserNode(node, parserContext),
            parserContext.sourceDocument
        );
    }
}
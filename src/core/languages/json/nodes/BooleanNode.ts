import { Range } from "../../../documents/Range";
import { JsonSyntaxTreeNode } from "../JsonSyntaxTreeNode";
import { JsonParserContext } from "../JsonParser";
import { Document } from "../../../documents/Document";

export class BooleanNode extends JsonSyntaxTreeNode {
    static readonly type = "Boolean";
    readonly type = BooleanNode.type;

    readonly value: boolean;

    constructor(
        value: boolean,
        parserNode: any,
        range: Range,
        sourceDocument: Document
    ) {
        super(parserNode, range, sourceDocument);
        this.value = value;
    }

    get childNodes(): JsonSyntaxTreeNode[] {
        return [];
    }

    static fromNearlyParserResultNode(node: any, parserContext: JsonParserContext): JsonSyntaxTreeNode {
        return new BooleanNode(
            node.value,
            node,
            BooleanNode.computeRangeFromParserNode(node, parserContext),
            parserContext.sourceDocument
        );
    }
}
import { Range } from "../../../documents/Range";
import { JsonSyntaxTreeNode } from "../JsonSyntaxTreeNode";
import { JsonParserContext } from "../JsonParser";
import { Document } from "../../../documents/Document";

export class NumberNode extends JsonSyntaxTreeNode {
    static readonly type = "Number";
    readonly type = NumberNode.type;

    readonly value: number;

    constructor(
        value: number,
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
        return new NumberNode(
            Number(node.value.text),
            node,
            NumberNode.computeRangeFromParserNode(node, parserContext),
            parserContext.sourceDocument
        );
    }
}
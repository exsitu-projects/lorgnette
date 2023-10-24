import { Range } from "../../../../core/documents/Range";
import { JsonSyntaxTreeNode } from "../JsonSyntaxTreeNode";
import { JsonParserContext } from "../JsonParser";
import { Document } from "../../../../core/documents/Document";

export class KeyNode extends JsonSyntaxTreeNode {
    static readonly type = "Key";
    readonly type = KeyNode.type;

    readonly value: string;

    constructor(
        value: string,
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
        return new KeyNode(
            node.value.text.slice(1, node.value.text.length - 1),
            node,
            KeyNode.computeRangeFromParserNode(node, parserContext),
            parserContext.sourceDocument
        );
    }
}
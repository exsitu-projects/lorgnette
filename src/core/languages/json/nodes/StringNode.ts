import { Range } from "../../../documents/Range";
import { JsonSyntaxTreeNode } from "../JsonSyntaxTreeNode";
import { JsonParserContext } from "../JsonParser";
import { Document } from "../../../documents/Document";

export class StringNode extends JsonSyntaxTreeNode {
    static readonly type = "String";
    readonly type = StringNode.type;

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
        return new StringNode(
            node.value.text.slice(1, node.value.text.length - 1),
            node,
            StringNode.computeRangeFromParserNode(node, parserContext),
            parserContext.sourceDocument
        );
    }
}
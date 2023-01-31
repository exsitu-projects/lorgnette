import { Range } from "../../../documents/Range";
import { JsonSyntaxTreeNode } from "../JsonSyntaxTreeNode";
import { JsonParserContext } from "../JsonParser";
import { PropertyNode } from "./PropertyNode";
import { convertParserNode } from "../JsonSyntaxTree";
import { Document } from "../../../documents/Document";

export class ObjectNode extends JsonSyntaxTreeNode {
    static readonly type = "Object";
    readonly type = ObjectNode.type;

    readonly properties: PropertyNode[];

    constructor(
        properties: PropertyNode[],
        parserNode: any,
        range: Range,
        sourceDocument: Document
    ) {
        super(parserNode, range, sourceDocument);
        this.properties = properties;
    }

    get childNodes(): JsonSyntaxTreeNode[] {
        return [...this.properties];
    }

    static fromNearlyParserResultNode(node: any, parserContext: JsonParserContext): JsonSyntaxTreeNode {
        return new ObjectNode(
            node.properties.map((n: any) => convertParserNode(n, parserContext)),
            node,
            ObjectNode.computeRangeFromParserNode(node, parserContext),
            parserContext.sourceDocument
        );
    }
}
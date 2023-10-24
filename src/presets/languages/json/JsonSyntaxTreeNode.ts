import { Document } from "../../../core/documents/Document";
import { Range } from "../../../core/documents/Range";
import { SyntaxTreeNode } from "../../../core/languages/SyntaxTreeNode";
import { JsonParserContext } from "./JsonParser";

export abstract class JsonSyntaxTreeNode extends SyntaxTreeNode {
    readonly range: Range;
    readonly parserNode: any;

    constructor(parserNode: any, range: Range, sourceDocument: Document) {
        super(sourceDocument);

        this.range = range;
        this.parserNode = parserNode;
    }

    protected static computeRangeFromParserNode(parserNode: any, parserContext: JsonParserContext): Range {
        const nonNullChildNodes = parserNode.data.filter((childParserNode: any) => !!childParserNode)
        const firstChildNode = nonNullChildNodes[0];
        const lastChildNode = nonNullChildNodes[nonNullChildNodes.length - 1];

        return new Range(
            parserContext.offsetToPositionConverter(firstChildNode.offset),
            parserContext.offsetToPositionConverter(lastChildNode.offset + lastChildNode.text.length)
        );
    }
}
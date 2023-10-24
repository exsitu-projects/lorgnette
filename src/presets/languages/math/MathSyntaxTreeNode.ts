import { Document } from "../../../core/documents/Document";
import { Position } from "../../../core/documents/Position";
import { Range } from "../../../core/documents/Range";
import { SyntaxTreeNode } from "../../../core/languages/SyntaxTreeNode";
import { MathParserContext } from "./MathParser";

export abstract class MathSyntaxTreeNode extends SyntaxTreeNode {
    readonly range: Range;
    readonly parserNode: any;

    constructor(parserNode: any, range: Range, sourceDocument: Document) {
        super(sourceDocument);

        this.range  = range;
        this.parserNode = parserNode;
    }

    get value(): number {
        return this.parserNode.value;
    }

    protected static computeRangeFromParserNode(parserNode: any, parserContext: MathParserContext): Range {
        const nonNullChildNodes = parserNode.data.filter((childParserNode: any) => childParserNode !== null)
        const firstChildNode = nonNullChildNodes[0];
        const lastChildNode = nonNullChildNodes[nonNullChildNodes.length - 1];

        return new Range(
            parserContext.offsetToPositionConverter(firstChildNode.offset),
            parserContext.offsetToPositionConverter(lastChildNode.offset + lastChildNode.text.length)
        );
    }
}
import { Position } from "../../documents/Position";
import { Range } from "../../documents/Range";
import { SyntaxTreeNode } from "../SyntaxTreeNode";
import { MathParserContext } from "./MathParser";

export abstract class MathSyntaxTreeNode extends SyntaxTreeNode {
    readonly range: Range;
    readonly parserNode: any;

    constructor(parserNode: any, range: Range) {
        super();

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

        // if (!firstChildNode || !lastChildNode) debugger

        const r = new Range(
            // new Position(firstChildNode.line - 1, firstChildNode.col - 1, firstChildNode.offset),
            // new Position(
            //     lastChildNode.line - 1 + lastChildNode.linebreaks,
            //     lastChildNode.col - 1,
            //     lastChildNode.offset +
            // ),
            parserContext.offsetToPositionConverter(firstChildNode.offset),
            parserContext.offsetToPositionConverter(lastChildNode.offset + lastChildNode.text.length)
        );
        
        if (Number.isNaN(r.end.column)) debugger
        return r
    }
}
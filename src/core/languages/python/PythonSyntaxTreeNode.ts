import { Position } from "../../documents/Position";
import { Range } from "../../documents/Range";
import { SyntaxTreeNode } from "../SyntaxTreeNode";
import { PythonParserContext } from "./PythonParser";

export abstract class PythonSyntaxTreeNode extends SyntaxTreeNode {
    readonly range: Range;
    readonly parserNode: any;

    constructor(parserNode: any, range: Range) {
        super();

        this.range = range;
        this.parserNode = parserNode;
    }

    protected static computeRangeFromParserNode(parserNode: any, parserContext: PythonParserContext): Range {
        return new Range(
            parserContext.offsetToPositionConverter(parserNode.offset),
            parserContext.offsetToPositionConverter(parserNode.endOffset)
        );
    }
}
import { Range } from "../../documents/Range";
import { SyntaxTreeNode } from "../SyntaxTreeNode";
import { JsonParserContext } from "./JsonParser";

export abstract class JsonSyntaxTreeNode extends SyntaxTreeNode {
    readonly range: Range;
    readonly parserNode: any;

    constructor(parserNode: any, range: Range) {
        super();

        this.range = range;
        this.parserNode = parserNode;
    }

    protected static computeRangeFromParserNode(parserNode: any, parserContext: JsonParserContext): Range {
        const nonNullChildNodes = parserNode.data.filter((childParserNode: any) => childParserNode !== null)
        const firstChildNode = nonNullChildNodes[0];
        const lastChildNode = nonNullChildNodes[nonNullChildNodes.length - 1];

        return new Range(
            parserContext.offsetToPositionConverter(firstChildNode.offset),
            parserContext.offsetToPositionConverter(lastChildNode.offset + lastChildNode.text.length)
        );
    }
}
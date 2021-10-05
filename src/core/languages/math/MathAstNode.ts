import { Range } from "../../documents/Range";
import { AstNode } from "../AstNode";
import { MathParserContext } from "./MathParser";

export abstract class MathAstNode extends AstNode {
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
        const firstChildNode = parserNode.data[0];
        const lastChildNode = parserNode.data[parserNode.data.length - 1];

        return new Range(
            parserContext.offsetToPositionConverter(firstChildNode.location),
            parserContext.offsetToPositionConverter(lastChildNode.location)
        );
    }
}
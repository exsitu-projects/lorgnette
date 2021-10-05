import { Range } from "../../../documents/Range";
import { MathAstNode } from "../MathAstNode";
import { MathParserContext } from "../MathParser";

export class ConstantNode extends MathAstNode {
    static readonly type = "Constant";
    readonly type = ConstantNode.type;

    readonly name: string;

    constructor(parserNode: any, range: Range) {
        super(parserNode, range);
        this.name = parserNode.name;
    }

    get childNodes(): MathAstNode[] {
        return [];
    }

    static fromNearlyParserResultNode(node: any, parserContext: MathParserContext): MathAstNode {
        return new ConstantNode(
            node,
            ConstantNode.computeRangeFromParserNode(node, parserContext)
        );
    }
}
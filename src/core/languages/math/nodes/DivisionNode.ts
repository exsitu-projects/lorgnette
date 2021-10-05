import { Range } from "../../../documents/Range";
import { convertParserNode } from "../MathAst";
import { MathAstNode } from "../MathAstNode";
import { MathParserContext } from "../MathParser";

export class DivisionNode extends MathAstNode {
    static readonly type = "Division";
    readonly type = DivisionNode.type;

    readonly leftOperand: MathAstNode;
    readonly rightOperand: MathAstNode;

    constructor(
        leftOperand: MathAstNode,
        rightOperand: MathAstNode,
        parserNode: any,
        range: Range
    ) {
        super(parserNode, range);
        this.leftOperand = leftOperand;
        this.rightOperand = rightOperand;
    }

    get childNodes(): MathAstNode[] {
        return [this.leftOperand, this.rightOperand];
    }

    static fromNearlyParserResultNode(node: any, parserContext: MathParserContext): MathAstNode {
        return new DivisionNode(
            convertParserNode(node.data[0], parserContext),
            convertParserNode(node.data[4], parserContext),
            node,
            DivisionNode.computeRangeFromParserNode(node, parserContext)
        );
    }
}
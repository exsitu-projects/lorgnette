import { Range } from "../../../documents/Range";
import { convertParserNode } from "../MathAst";
import { MathAstNode } from "../MathAstNode";
import { MathParserContext } from "../MathParser";

export class SubstractionNode extends MathAstNode {
    static readonly type = "Substraction";
    readonly type = SubstractionNode.type;

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
        return new SubstractionNode(
            convertParserNode(node.data[0], parserContext),
            convertParserNode(node.data[4], parserContext),
            node,
            SubstractionNode.computeRangeFromParserNode(node, parserContext)
        );
    }
}
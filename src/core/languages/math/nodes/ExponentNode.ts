import { Range } from "../../../documents/Range";
import { convertParserNode } from "../MathSyntaxTree";
import { MathSyntaxTreeNode } from "../MathSyntaxTreeNode";
import { MathParserContext } from "../MathParser";
import { Document } from "../../../documents/Document";

export class ExponentNode extends MathSyntaxTreeNode {
    static readonly type = "Exponent";
    readonly type = ExponentNode.type;

    readonly leftOperand: MathSyntaxTreeNode;
    readonly rightOperand: MathSyntaxTreeNode;

    constructor(
        leftOperand: MathSyntaxTreeNode,
        rightOperand: MathSyntaxTreeNode,
        parserNode: any,
        range: Range,
        sourceDocument: Document
    ) {
        super(parserNode, range, sourceDocument);
        this.leftOperand = leftOperand;
        this.rightOperand = rightOperand;
    }

    get childNodes(): MathSyntaxTreeNode[] {
        return [this.leftOperand, this.rightOperand];
    }

    static fromNearlyParserResultNode(node: any, parserContext: MathParserContext): MathSyntaxTreeNode {
        return new ExponentNode(
            convertParserNode(node.data[0], parserContext),
            convertParserNode(node.data[2], parserContext),
            node,
            ExponentNode.computeRangeFromParserNode(node, parserContext),
            parserContext.sourceDocument
        );
    }
}
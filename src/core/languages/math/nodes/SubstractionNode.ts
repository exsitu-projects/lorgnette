import { Range } from "../../../documents/Range";
import { convertParserNode } from "../MathSyntaxTree";
import { MathSyntaxTreeNode } from "../MathSyntaxTreeNode";
import { MathParserContext } from "../MathParser";
import { Document } from "../../../documents/Document";

export class SubstractionNode extends MathSyntaxTreeNode {
    static readonly type = "Substraction";
    readonly type = SubstractionNode.type;

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
        return new SubstractionNode(
            convertParserNode(node.data[0], parserContext),
            convertParserNode(node.data[4], parserContext),
            node,
            SubstractionNode.computeRangeFromParserNode(node, parserContext),
            parserContext.sourceDocument
        );
    }
}
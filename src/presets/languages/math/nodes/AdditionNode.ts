import { Range } from "../../../../core/documents/Range";
import { convertParserNode } from "../MathSyntaxTree";
import { MathSyntaxTreeNode } from "../MathSyntaxTreeNode";
import { MathParserContext } from "../MathParser";
import { Document } from "../../../../core/documents/Document";

export class AdditionNode extends MathSyntaxTreeNode {
    static readonly type = "Addition";
    readonly type = AdditionNode.type;

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
        return new AdditionNode(
            convertParserNode(node.data[0], parserContext),
            convertParserNode(node.data[4], parserContext),
            node,
            AdditionNode.computeRangeFromParserNode(node, parserContext),
            parserContext.sourceDocument
        );
    }
}
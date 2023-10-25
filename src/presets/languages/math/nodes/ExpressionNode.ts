import { Range } from "../../../../core/documents/Range";
import { convertParserNode } from "../MathSyntaxTree";
import { MathSyntaxTreeNode } from "../MathSyntaxTreeNode";
import { MathParserContext } from "../MathParser";
import { Document } from "../../../../core/documents/Document";

export class ExpressionNode extends MathSyntaxTreeNode {
    static readonly type = "Expression";
    readonly type = ExpressionNode.type;

    readonly content: MathSyntaxTreeNode;

    constructor(
        content: MathSyntaxTreeNode,
        parserNode: any,
        range: Range,
        sourceDocument: Document
    ) {
        super(parserNode, range, sourceDocument);
        this.content = content;
    }

    get childNodes(): MathSyntaxTreeNode[] {
        return [this.content];
    }

    static fromNearlyParserResultNode(node: any, parserContext: MathParserContext): MathSyntaxTreeNode {
        return new ExpressionNode(
            convertParserNode(node.data[1], parserContext),
            node,
            ExpressionNode.computeRangeFromParserNode(node, parserContext),
            parserContext.sourceDocument
        );
    }
}
import { Range } from "../../../documents/Range";
import { convertParserNode } from "../MathSyntaxTree";
import { MathSyntaxTreeNode } from "../MathSyntaxTreeNode";
import { MathParserContext } from "../MathParser";
import { Document } from "../../../documents/Document";

export class ParenthesesNode extends MathSyntaxTreeNode {
    static readonly type = "Parentheses";
    readonly type = ParenthesesNode.type;

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
        return new ParenthesesNode(
            convertParserNode(node.data[2], parserContext),
            node,
            ParenthesesNode.computeRangeFromParserNode(node, parserContext),
            parserContext.sourceDocument
        );
    }
}
import { Range } from "../../../documents/Range";
import { convertParserNode } from "../MathSyntaxTree";
import { MathSyntaxTreeNode } from "../MathSyntaxTreeNode";
import { MathParserContext } from "../MathParser";

export class ParenthesesNode extends MathSyntaxTreeNode {
    static readonly type = "Parentheses";
    readonly type = ParenthesesNode.type;

    readonly content: MathSyntaxTreeNode;

    constructor(content: MathSyntaxTreeNode, parserNode: any, range: Range) {
        super(parserNode, range);
        this.content = content;
    }

    get childNodes(): MathSyntaxTreeNode[] {
        return [this.content];
    }

    static fromNearlyParserResultNode(node: any, parserContext: MathParserContext): MathSyntaxTreeNode {
        return new ParenthesesNode(
            convertParserNode(node.data[2], parserContext),
            node,
            ParenthesesNode.computeRangeFromParserNode(node, parserContext)
        );
    }
}
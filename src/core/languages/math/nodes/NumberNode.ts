import { MathSyntaxTreeNode } from "../MathSyntaxTreeNode";
import { MathParserContext } from "../MathParser";

export class NumberNode extends MathSyntaxTreeNode {
    static readonly type = "Number";
    readonly type = NumberNode.type;

    get childNodes(): MathSyntaxTreeNode[] {
        return [];
    }

    static fromNearlyParserResultNode(node: any, parserContext: MathParserContext): MathSyntaxTreeNode {
        return new NumberNode(
            node,
            NumberNode.computeRangeFromParserNode(node, parserContext)
        );
    }
}
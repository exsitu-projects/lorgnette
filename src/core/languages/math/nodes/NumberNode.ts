import { MathAstNode } from "../MathAstNode";
import { MathParserContext } from "../MathParser";

export class NumberNode extends MathAstNode {
    static readonly type = "Number";
    readonly type = NumberNode.type;

    get childNodes(): MathAstNode[] {
        return [];
    }

    static fromNearlyParserResultNode(node: any, parserContext: MathParserContext): MathAstNode {
        return new NumberNode(
            node,
            NumberNode.computeRangeFromParserNode(node, parserContext)
        );
    }
}
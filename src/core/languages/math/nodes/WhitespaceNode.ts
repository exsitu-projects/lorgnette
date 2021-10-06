import { Range } from "../../../documents/Range";
import { convertParserNode } from "../MathAst";
import { MathAstNode } from "../MathAstNode";
import { MathParserContext } from "../MathParser";

export class WhitespaceNode extends MathAstNode {
    static readonly type = "Whitespace";
    readonly type = WhitespaceNode.type;

    get childNodes(): MathAstNode[] {
        return [];
    }

    static fromNearlyParserResultNode(node: any, parserContext: MathParserContext): MathAstNode {
        return new WhitespaceNode(
            node,
            WhitespaceNode.computeRangeFromParserNode(node, parserContext)
        );
    }
}
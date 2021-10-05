import { Range } from "../../../documents/Range";
import { convertParserNode } from "../MathAst";
import { MathAstNode } from "../MathAstNode";
import { MathParserContext } from "../MathParser";

export class ParenthesesNode extends MathAstNode {
    static readonly type = "Parentheses";
    readonly type = ParenthesesNode.type;

    readonly content: MathAstNode;

    constructor(content: MathAstNode, parserNode: any, range: Range) {
        super(parserNode, range);
        this.content = content;
    }

    get childNodes(): MathAstNode[] {
        return [this.content];
    }

    static fromNearlyParserResultNode(node: any, parserContext: MathParserContext): MathAstNode {
        return new ParenthesesNode(
            convertParserNode(node.data[2], parserContext),
            node,
            ParenthesesNode.computeRangeFromParserNode(node, parserContext)
        );
    }
}
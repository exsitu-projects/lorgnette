import { Range } from "../../../documents/Range";
import { convertParserNode } from "../MathAst";
import { MathAstNode } from "../MathAstNode";
import { MathParserContext } from "../MathParser";

export class ExpressionNode extends MathAstNode {
    static readonly type = "Expression";
    readonly type = ExpressionNode.type;

    readonly content: MathAstNode;

    constructor(content: MathAstNode, parserNode: any, range: Range) {
        super(parserNode, range);
        this.content = content;
    }

    get childNodes(): MathAstNode[] {
        return [this.content];
    }

    static fromNearlyParserResultNode(node: any, parserContext: MathParserContext): MathAstNode {
        return new ExpressionNode(
            convertParserNode(node.data[1], parserContext),
            node,
            ExpressionNode.computeRangeFromParserNode(node, parserContext)
        );
    }
}
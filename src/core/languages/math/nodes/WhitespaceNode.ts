import { Range } from "../../../documents/Range";
import { convertParserNode } from "../MathSyntaxTree";
import { MathSyntaxTreeNode } from "../MathSyntaxTreeNode";
import { MathParserContext } from "../MathParser";

export class WhitespaceNode extends MathSyntaxTreeNode {
    static readonly type = "Whitespace";
    readonly type = WhitespaceNode.type;

    get childNodes(): MathSyntaxTreeNode[] {
        return [];
    }

    static fromNearlyParserResultNode(node: any, parserContext: MathParserContext): MathSyntaxTreeNode {
        return new WhitespaceNode(
            node,
            WhitespaceNode.computeRangeFromParserNode(node, parserContext),
            parserContext.sourceDocument
        );
    }
}
import { Range } from "../../../documents/Range";
import { convertParserNode } from "../MathAst";
import { MathAstNode } from "../MathAstNode";
import { MathParserContext } from "../MathParser";

export class FunctionNode extends MathAstNode {
    static readonly type = "Function";
    readonly type = FunctionNode.type;

    readonly name: string;
    readonly arguments: MathAstNode[];

    constructor(
        name: string,
        args: MathAstNode[],
        parserNode: any,
        range: Range
    ) {
        super(parserNode, range);
        this.name = name;
        this.arguments = args;
    }

    get childNodes(): MathAstNode[] {
        return [...this.arguments];
    }

    // Only support functions with exactly one argument.
    static fromNearlyParserResultNode(node: any, parserContext: MathParserContext): MathAstNode {
        return new FunctionNode(
            node.name,
            [convertParserNode(node.data[2], parserContext)],
            node,
            FunctionNode.computeRangeFromParserNode(node, parserContext)
        );
    }
}
import { Range } from "../../../documents/Range";
import { convertParserNode } from "../MathSyntaxTree";
import { MathSyntaxTreeNode } from "../MathSyntaxTreeNode";
import { MathParserContext } from "../MathParser";
import { Document } from "../../../documents/Document";

export class FunctionNode extends MathSyntaxTreeNode {
    static readonly type = "Function";
    readonly type = FunctionNode.type;

    readonly name: string;
    readonly arguments: MathSyntaxTreeNode[];

    constructor(
        name: string,
        args: MathSyntaxTreeNode[],
        parserNode: any,
        range: Range,
        sourceDocument: Document
    ) {
        super(parserNode, range, sourceDocument);
        this.name = name;
        this.arguments = args;
    }

    get childNodes(): MathSyntaxTreeNode[] {
        return [...this.arguments];
    }

    // Only support functions with exactly one argument.
    static fromNearlyParserResultNode(node: any, parserContext: MathParserContext): MathSyntaxTreeNode {
        return new FunctionNode(
            node.name,
            [convertParserNode(node.data[1], parserContext)],
            node,
            FunctionNode.computeRangeFromParserNode(node, parserContext),
            parserContext.sourceDocument
        );
    }
}
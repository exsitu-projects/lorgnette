import { Range } from "../../../../core/documents/Range";
import { MathSyntaxTreeNode } from "../MathSyntaxTreeNode";
import { MathParserContext } from "../MathParser";
import { Document } from "../../../../core/documents/Document";

export class ConstantNode extends MathSyntaxTreeNode {
    static readonly type = "Constant";
    readonly type = ConstantNode.type;

    readonly name: string;

    constructor(
        parserNode: any,
        range: Range,
        sourceDocument: Document
    ) {
        super(parserNode, range, sourceDocument);
        this.name = parserNode.name;
    }

    get childNodes(): MathSyntaxTreeNode[] {
        return [];
    }

    static fromNearlyParserResultNode(node: any, parserContext: MathParserContext): MathSyntaxTreeNode {
        return new ConstantNode(
            node,
            ConstantNode.computeRangeFromParserNode(node, parserContext),
            parserContext.sourceDocument
        );
    }
}
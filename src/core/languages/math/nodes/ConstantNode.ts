import { Range } from "../../../documents/Range";
import { MathSyntaxTreeNode } from "../MathSyntaxTreeNode";
import { MathParserContext } from "../MathParser";

export class ConstantNode extends MathSyntaxTreeNode {
    static readonly type = "Constant";
    readonly type = ConstantNode.type;

    readonly name: string;

    constructor(parserNode: any, range: Range) {
        super(parserNode, range);
        this.name = parserNode.name;
    }

    get childNodes(): MathSyntaxTreeNode[] {
        return [];
    }

    static fromNearlyParserResultNode(node: any, parserContext: MathParserContext): MathSyntaxTreeNode {
        return new ConstantNode(
            node,
            ConstantNode.computeRangeFromParserNode(node, parserContext)
        );
    }
}
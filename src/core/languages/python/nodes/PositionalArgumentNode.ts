import { Range } from "../../../documents/Range";
import { PythonSyntaxTreeNode } from "../PythonSyntaxTreeNode";
import { PythonParserContext } from "../PythonParser";
import { ExpressionNode } from "./ExpressionNode";

export class PositionalArgumentNode extends PythonSyntaxTreeNode {
    static readonly type = "PositionalArgument";
    readonly type = PositionalArgumentNode.type;

    readonly value: ExpressionNode;

    constructor(value: ExpressionNode, parserNode: any, range: Range) {
        super(parserNode, range);
        this.value = value;
    }

    get childNodes(): PythonSyntaxTreeNode[] {
        return [this.value];
    }

    static fromNearlyParserResultNode(node: any, parserContext: PythonParserContext): PositionalArgumentNode {
        return new PositionalArgumentNode(
            ExpressionNode.fromNearlyParserResultNode(node.value, parserContext),
            node,
            PositionalArgumentNode.computeRangeFromParserNode(node, parserContext)
        );
    }
}
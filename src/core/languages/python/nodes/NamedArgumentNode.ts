import { Range } from "../../../documents/Range";
import { PythonSyntaxTreeNode } from "../PythonSyntaxTreeNode";
import { PythonParserContext } from "../PythonParser";
import { ExpressionNode } from "./ExpressionNode";
import { convertParserNode } from "../PythonSyntaxTree";

export class NamedArgumentNode extends PythonSyntaxTreeNode {
    static readonly type = "NamedArgument";
    readonly type = NamedArgumentNode.type;

    readonly name: string;
    readonly value: ExpressionNode;

    constructor(name: string, value: ExpressionNode, parserNode: any, range: Range) {
        super(parserNode, range);
        this.name = name;
        this.value = value;
    }

    get childNodes(): PythonSyntaxTreeNode[] {
        return [this.value];
    }

    static fromNearlyParserResultNode(node: any, parserContext: PythonParserContext): NamedArgumentNode {
        return new NamedArgumentNode(
            node.name,
            ExpressionNode.fromNearlyParserResultNode(node.value, parserContext),
            node,
            NamedArgumentNode.computeRangeFromParserNode(node, parserContext)
        );
    }
}
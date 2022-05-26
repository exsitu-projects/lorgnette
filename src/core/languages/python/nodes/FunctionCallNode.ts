import { Range } from "../../../documents/Range";
import { PythonSyntaxTreeNode } from "../PythonSyntaxTreeNode";
import { PythonParserContext } from "../PythonParser";
import { convertParserNode } from "../PythonSyntaxTree";
import { ArgumentListNode } from "./ArgumentListNode";
import { IndexedAccessNode } from "./IndexedAccessNode";
import { NamedAccessNode } from "./NamedAccessNode";

export type CallableExpressionNode =
    | NamedAccessNode
    | IndexedAccessNode
    | FunctionCallNode;

export class FunctionCallNode extends PythonSyntaxTreeNode {
    static readonly type = "FunctionCall";
    readonly type = FunctionCallNode.type;

    readonly callee: CallableExpressionNode;
    readonly arguments: ArgumentListNode;

    constructor(callee: CallableExpressionNode, argumentList: ArgumentListNode, parserNode: any, range: Range) {
        super(parserNode, range);
        this.callee = callee;
        this.arguments = argumentList;
    }

    get childNodes(): PythonSyntaxTreeNode[] {
        return [this.callee, this.arguments];
    }

    static fromNearlyParserResultNode(node: any, parserContext: PythonParserContext): FunctionCallNode {
        console.log("FunctionCallNode fromNearlyParserResultNode", node)
        return new FunctionCallNode(
            convertParserNode(node.callee, parserContext) as CallableExpressionNode,
            ArgumentListNode.fromNearlyParserResultNode(node.argumentList, parserContext),
            node,
            FunctionCallNode.computeRangeFromParserNode(node, parserContext)
        );
    }
}
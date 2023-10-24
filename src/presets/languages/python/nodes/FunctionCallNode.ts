import { Range } from "../../../../core/documents/Range";
import { PythonSyntaxTreeNode } from "../PythonSyntaxTreeNode";
import { PythonParserContext } from "../PythonParser";
import { convertParserNode } from "../PythonSyntaxTree";
import { ArgumentListNode } from "./ArgumentListNode";
import { IndexedAccessNode } from "./IndexedAccessNode";
import { NamedAccessNode } from "./NamedAccessNode";
import { IdentifierNode } from "./IdentifierNode";
import { Document } from "../../../../core/documents/Document";

export type CallableExpressionNode =
    | IdentifierNode
    | NamedAccessNode
    | IndexedAccessNode
    | FunctionCallNode;

export class FunctionCallNode extends PythonSyntaxTreeNode {
    static readonly type = "FunctionCall";
    readonly type = FunctionCallNode.type;

    readonly callee: CallableExpressionNode;
    readonly arguments: ArgumentListNode;

    constructor(
        callee: CallableExpressionNode,
        argumentList: ArgumentListNode,
        parserNode: any,
        range: Range,
        sourceDocument: Document
    ) {
        super(parserNode, range, sourceDocument);
        this.callee = callee;
        this.arguments = argumentList;
    }

    get childNodes(): PythonSyntaxTreeNode[] {
        return [this.callee, this.arguments];
    }

    static fromNearlyParserResultNode(node: any, parserContext: PythonParserContext): FunctionCallNode {
        return new FunctionCallNode(
            convertParserNode(node.callee, parserContext) as CallableExpressionNode,
            ArgumentListNode.fromNearlyParserResultNode(node.argumentList, parserContext),
            node,
            FunctionCallNode.computeRangeFromParserNode(node, parserContext),
            parserContext.sourceDocument
        );
    }
}
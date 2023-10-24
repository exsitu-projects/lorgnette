import { Range } from "../../../../core/documents/Range";
import { PythonSyntaxTreeNode } from "../PythonSyntaxTreeNode";
import { PythonParserContext } from "../PythonParser";
import { ExpressionNode } from "./ExpressionNode";
import { BooleanNode } from "./BooleanNode";
import { FunctionCallNode } from "./FunctionCallNode";
import { IdentifierNode } from "./IdentifierNode";
import { NamedAccessNode } from "./NamedAccessNode";
import { StringNode } from "./StringNode";
import { NumberNode } from "./NumberNode";
import { convertParserNode } from "../PythonSyntaxTree";
import { Document } from "../../../../core/documents/Document";

export type IndexableExpressionNode =
    | IdentifierNode
    | NamedAccessNode
    | IndexedAccessNode
    | FunctionCallNode
    | StringNode
    | NumberNode
    | BooleanNode;

export class IndexedAccessNode extends PythonSyntaxTreeNode {
    static readonly type = "IndexedAccess";
    readonly type = IndexedAccessNode.type;

    readonly expression: IndexableExpressionNode;
    readonly index: ExpressionNode;

    constructor(
        expression: IndexableExpressionNode,
        index: ExpressionNode,
        parserNode: any,
        range: Range,
        sourceDocument: Document
    ) {
        super(parserNode, range, sourceDocument);
        this.expression = expression;
        this.index = index;
    }

    get childNodes(): PythonSyntaxTreeNode[] {
        return [this.expression, this.index];
    }

    static fromNearlyParserResultNode(node: any, parserContext: PythonParserContext): IndexedAccessNode {
        return new IndexedAccessNode(
            convertParserNode(node.expression, parserContext) as IndexableExpressionNode,
            ExpressionNode.fromNearlyParserResultNode(node.index, parserContext),
            node,
            IndexedAccessNode.computeRangeFromParserNode(node, parserContext),
            parserContext.sourceDocument
        );
    }
}
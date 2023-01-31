import { Range } from "../../../documents/Range";
import { PythonSyntaxTreeNode } from "../PythonSyntaxTreeNode";
import { PythonParserContext } from "../PythonParser";
import { IdentifierNode } from "./IdentifierNode";
import { ExpressionNode } from "./ExpressionNode";
import { BooleanNode } from "./BooleanNode";
import { FunctionCallNode } from "./FunctionCallNode";
import { IndexedAccessNode } from "./IndexedAccessNode";
import { StringNode } from "./StringNode";
import { NumberNode } from "./NumberNode";
import { convertParserNode } from "../PythonSyntaxTree";
import { Document } from "../../../documents/Document";

export type IndexableExpressionNode =
    | IdentifierNode
    | NamedAccessNode
    | IndexedAccessNode
    | FunctionCallNode
    | StringNode
    | NumberNode
    | BooleanNode;

export class NamedAccessNode extends PythonSyntaxTreeNode {
    static readonly type = "NamedAccess";
    readonly type = NamedAccessNode.type;

    readonly expression: IndexableExpressionNode;
    readonly identifier: IdentifierNode;

    constructor(
        expression: IndexableExpressionNode,
        identifier: IdentifierNode,
        parserNode: any,
        range: Range,
        sourceDocument: Document
    ) {
        super(parserNode, range, sourceDocument);
        this.expression = expression;
        this.identifier = identifier;
    }

    get childNodes(): PythonSyntaxTreeNode[] {
        return [this.expression, this.identifier];
    }

    static fromNearlyParserResultNode(node: any, parserContext: PythonParserContext): NamedAccessNode {
        return new NamedAccessNode(
            convertParserNode(node.expression, parserContext) as IndexableExpressionNode,
            IdentifierNode.fromNearlyParserResultNode(node.identifier, parserContext),
            node,
            NamedAccessNode.computeRangeFromParserNode(node, parserContext),
            parserContext.sourceDocument
        );
    }
}
import { Range } from "../../../../core/documents/Range";
import { PythonSyntaxTreeNode } from "../PythonSyntaxTreeNode";
import { PythonParserContext } from "../PythonParser";
import { FunctionCallNode } from "./FunctionCallNode";
import { BooleanNode } from "./BooleanNode";
import { NoneNode } from "./NoneNode";
import { NumberNode } from "./NumberNode";
import { StringNode } from "./StringNode";
import { convertParserNode } from "../PythonSyntaxTree";
import { NamedAccessNode } from "./NamedAccessNode";
import { IndexedAccessNode } from "./IndexedAccessNode";
import { IdentifierNode } from "./IdentifierNode";
import { Document } from "../../../../core/documents/Document";

export type ValueNode =
    | IdentifierNode
    | NamedAccessNode
    | IndexedAccessNode
    | FunctionCallNode
    | StringNode
    | NumberNode
    | BooleanNode
    | NoneNode;

export class ExpressionNode extends PythonSyntaxTreeNode {
    static readonly type = "Expression";
    readonly type = ExpressionNode.type;

    readonly value: ValueNode;

    constructor(
        value: ValueNode,
        parserNode: any,
        range: Range,
        sourceDocument: Document
    ) {
        super(parserNode, range, sourceDocument);
        this.value = value;
    }

    get childNodes(): PythonSyntaxTreeNode[] {
        return [this.value];
    }

    static fromNearlyParserResultNode(node: any, parserContext: PythonParserContext): ExpressionNode {
        return new ExpressionNode(
            convertParserNode(node.value, parserContext) as ValueNode,
            node,
            ExpressionNode.computeRangeFromParserNode(node, parserContext),
            parserContext.sourceDocument
        );
    }
}
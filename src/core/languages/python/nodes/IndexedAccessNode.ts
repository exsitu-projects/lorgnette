import { Range } from "../../../documents/Range";
import { PythonSyntaxTreeNode } from "../PythonSyntaxTreeNode";
import { PythonParserContext } from "../PythonParser";
import { IdentifierNode } from "./IdentifierNode";
import { ExpressionNode } from "./ExpressionNode";

export class IndexedAccessNode extends PythonSyntaxTreeNode {
    static readonly type = "IndexedAccess";
    readonly type = IndexedAccessNode.type;

    readonly identifier: IdentifierNode;
    readonly index: ExpressionNode;

    constructor(identifier: IdentifierNode, index: ExpressionNode, parserNode: any, range: Range) {
        super(parserNode, range);
        this.identifier = identifier;
        this.index = index;
    }

    get childNodes(): PythonSyntaxTreeNode[] {
        return [this.identifier, this.index];
    }

    static fromNearlyParserResultNode(node: any, parserContext: PythonParserContext): IndexedAccessNode {
        return new IndexedAccessNode(
            IdentifierNode.fromNearlyParserResultNode(node.value, parserContext),
            ExpressionNode.fromNearlyParserResultNode(node.value, parserContext),
            node,
            IndexedAccessNode.computeRangeFromParserNode(node, parserContext)
        );
    }
}
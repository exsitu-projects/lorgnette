import { Range } from "../../../documents/Range";
import { PythonSyntaxTreeNode } from "../PythonSyntaxTreeNode";
import { PythonParserContext } from "../PythonParser";
import { IdentifierNode } from "./IdentifierNode";

export class NamedAccessNode extends PythonSyntaxTreeNode {
    static readonly type = "NamedAccess";
    readonly type = NamedAccessNode.type;

    readonly identifiers: IdentifierNode[];

    constructor(identifiers: IdentifierNode[], parserNode: any, range: Range) {
        super(parserNode, range);
        this.identifiers = identifiers;
    }

    get childNodes(): PythonSyntaxTreeNode[] {
        return [...this.identifiers];
    }

    static fromNearlyParserResultNode(node: any, parserContext: PythonParserContext): NamedAccessNode {
        return new NamedAccessNode(
            node.identifiers.map((n: any) => IdentifierNode.fromNearlyParserResultNode(n, parserContext)),
            node,
            NamedAccessNode.computeRangeFromParserNode(node, parserContext)
        );
    }
}
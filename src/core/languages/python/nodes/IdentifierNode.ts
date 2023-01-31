import { Range } from "../../../documents/Range";
import { PythonSyntaxTreeNode } from "../PythonSyntaxTreeNode";
import { PythonParserContext } from "../PythonParser";
import { Document } from "../../../documents/Document";

export class IdentifierNode extends PythonSyntaxTreeNode {
    static readonly type = "Identifier";
    readonly type = IdentifierNode.type;

    readonly name: string;

    constructor(
        name: string,
        parserNode: any,
        range: Range,
        sourceDocument: Document
    ) {
        super(parserNode, range, sourceDocument);
        this.name = name;
    }

    get childNodes(): PythonSyntaxTreeNode[] {
        return [];
    }

    static fromNearlyParserResultNode(node: any, parserContext: PythonParserContext): IdentifierNode {
        return new IdentifierNode(
            node.name,
            node,
            IdentifierNode.computeRangeFromParserNode(node, parserContext),
            parserContext.sourceDocument
        );
    }
}
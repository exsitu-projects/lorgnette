import { Range } from "../../../../core/documents/Range";
import { PythonSyntaxTreeNode } from "../PythonSyntaxTreeNode";
import { PythonParserContext } from "../PythonParser";
import { Document } from "../../../../core/documents/Document";

export class NumberNode extends PythonSyntaxTreeNode {
    static readonly type = "Number";
    readonly type = NumberNode.type;

    readonly value: number;

    constructor(
        value: number,
        parserNode: any,
        range: Range,
        sourceDocument: Document
    ) {
        super(parserNode, range, sourceDocument);
        this.value = value;
    }

    get childNodes(): PythonSyntaxTreeNode[] {
        return [];
    }

    static fromNearlyParserResultNode(node: any, parserContext: PythonParserContext): NumberNode {
        return new NumberNode(
            Number(node.value.text),
            node,
            NumberNode.computeRangeFromParserNode(node, parserContext),
            parserContext.sourceDocument
        );
    }
}
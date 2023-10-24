import { Range } from "../../../../core/documents/Range";
import { PythonSyntaxTreeNode } from "../PythonSyntaxTreeNode";
import { PythonParserContext } from "../PythonParser";
import { Document } from "../../../../core/documents/Document";

export class NoneNode extends PythonSyntaxTreeNode {
    static readonly type = "None";
    readonly type = NoneNode.type;

    constructor(
        parserNode: any,
        range: Range,
        sourceDocument: Document
    ) {
        super(parserNode, range, sourceDocument);
    }

    get childNodes(): PythonSyntaxTreeNode[] {
        return [];
    }

    static fromNearlyParserResultNode(node: any, parserContext: PythonParserContext): NoneNode {
        return new NoneNode(
            node,
            NoneNode.computeRangeFromParserNode(node, parserContext),
            parserContext.sourceDocument
        );
    }
}
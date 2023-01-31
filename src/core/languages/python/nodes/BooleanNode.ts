import { Range } from "../../../documents/Range";
import { PythonSyntaxTreeNode } from "../PythonSyntaxTreeNode";
import { PythonParserContext } from "../PythonParser";
import { Document } from "../../../documents/Document";

export class BooleanNode extends PythonSyntaxTreeNode {
    static readonly type = "Boolean";
    readonly type = BooleanNode.type;

    readonly value: boolean;

    constructor(
        value: boolean,
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

    static fromNearlyParserResultNode(node: any, parserContext: PythonParserContext): BooleanNode {
        return new BooleanNode(
            node.value,
            node,
            BooleanNode.computeRangeFromParserNode(node, parserContext),
            parserContext.sourceDocument
        );
    }
}
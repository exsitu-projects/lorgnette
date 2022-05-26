import { Range } from "../../../documents/Range";
import { PythonSyntaxTreeNode } from "../PythonSyntaxTreeNode";
import { PythonParserContext } from "../PythonParser";

export class NoneNode extends PythonSyntaxTreeNode {
    static readonly type = "None";
    readonly type = NoneNode.type;

    constructor(parserNode: any, range: Range) {
        super(parserNode, range);
    }

    get childNodes(): PythonSyntaxTreeNode[] {
        return [];
    }

    static fromNearlyParserResultNode(node: any, parserContext: PythonParserContext): NoneNode {
        return new NoneNode(
            node,
            NoneNode.computeRangeFromParserNode(node, parserContext)
        );
    }
}
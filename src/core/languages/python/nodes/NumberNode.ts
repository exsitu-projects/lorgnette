import { Range } from "../../../documents/Range";
import { PythonSyntaxTreeNode } from "../PythonSyntaxTreeNode";
import { PythonParserContext } from "../PythonParser";

export class NumberNode extends PythonSyntaxTreeNode {
    static readonly type = "Number";
    readonly type = NumberNode.type;

    readonly value: number;

    constructor(value: number, parserNode: any, range: Range) {
        super(parserNode, range);
        this.value = value;
    }

    get childNodes(): PythonSyntaxTreeNode[] {
        return [];
    }

    static fromNearlyParserResultNode(node: any, parserContext: PythonParserContext): NumberNode {
        return new NumberNode(
            Number(node.value.text),
            node,
            NumberNode.computeRangeFromParserNode(node, parserContext)
        );
    }
}
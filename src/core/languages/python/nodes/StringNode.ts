import { Range } from "../../../documents/Range";
import { PythonSyntaxTreeNode } from "../PythonSyntaxTreeNode";
import { PythonParserContext } from "../PythonParser";

export class StringNode extends PythonSyntaxTreeNode {
    static readonly type = "String";
    readonly type = StringNode.type;

    // readonly prefix: string;
    readonly delimiter: string;
    readonly content: string;

    constructor(
        // prefix: string,
        delimiter: string,
        content: string,
        parserNode: any,
        range: Range
    ) {
        super(parserNode, range);
        // this.prefix = prefix;
        this.delimiter = delimiter;
        this.content = content;
    }

    get childNodes(): PythonSyntaxTreeNode[] {
        return [];
    }

    static fromNearlyParserResultNode(node: any, parserContext: PythonParserContext): StringNode {
        const delimiterLength = node.delimiter.length;
        const stringContent = node.value.slice(
            delimiterLength - 1,
            node.value.length - delimiterLength
        );

        return new StringNode(
            // node.value.text.slice(1, node.value.text.length - 1),
            node.delimiter,
            stringContent,
            node,
            StringNode.computeRangeFromParserNode(node, parserContext)
        );
    }
}
import { Range } from "../../../../core/documents/Range";
import { PythonSyntaxTreeNode } from "../PythonSyntaxTreeNode";
import { PythonParserContext } from "../PythonParser";
import { PositionalArgumentNode } from "./PositionalArgumentNode";
import { NamedArgumentNode } from "./NamedArgumentNode";
import { Document } from "../../../../core/documents/Document";

export class ArgumentListNode extends PythonSyntaxTreeNode {
    static readonly type = "ArgumentList";
    readonly type = ArgumentListNode.type;

    readonly positionalArguments: PositionalArgumentNode[];
    readonly namedArguments: NamedArgumentNode[];

    constructor(
        positionalArguments: PositionalArgumentNode[],
        namedArguments: NamedArgumentNode[],
        parserNode: any,
        range: Range,
        sourceDocument: Document
    ) {
        super(parserNode, range, sourceDocument);
        this.positionalArguments = positionalArguments;
        this.namedArguments = namedArguments;
    }

    get childNodes(): PythonSyntaxTreeNode[] {
        return [...this.positionalArguments, ...this.namedArguments];
    }

    static fromNearlyParserResultNode(node: any, parserContext: PythonParserContext): ArgumentListNode {
        return new ArgumentListNode(
            node.positionalArguments.map((n: any) => PositionalArgumentNode.fromNearlyParserResultNode(n, parserContext)),
            node.namedArguments.map((n: any) => NamedArgumentNode.fromNearlyParserResultNode(n, parserContext)),
            node,
            ArgumentListNode.computeRangeFromParserNode(node, parserContext),
            parserContext.sourceDocument
        );
    }
}
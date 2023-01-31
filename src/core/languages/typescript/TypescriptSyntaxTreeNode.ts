import { SyntaxTreeNode } from "../SyntaxTreeNode";
import { ts } from "ts-morph";
import { Range } from "../../documents/Range";
import { TypescriptParserContext } from "./TypescriptParser";
import { Document } from "../../documents/Document";

export class TypescriptSyntaxTreeNode extends SyntaxTreeNode {
    readonly type: string;
    readonly range: Range;
    readonly childNodes: TypescriptSyntaxTreeNode[];
    readonly parserNode: ts.Node;

    constructor(
        type: string,
        range: Range,
        childNodes: TypescriptSyntaxTreeNode[],
        parserNode: ts.Node,
        sourceDocument: Document
    ) {
        super(sourceDocument);

        this.type = type;
        this.range  = range;
        this.childNodes = childNodes;
        this.parserNode = parserNode;
    }

    get text(): string {
        return this.parserNode.getText();
    }

    protected static computeRangeFromParserNode(parserNode: ts.Node, parserContext: TypescriptParserContext): Range {
        const startOffset = parserNode.getStart();
        const endOffset = parserNode.getEnd();

        return new Range(
            parserContext.offsetToPositionConverter(startOffset),
            parserContext.offsetToPositionConverter(endOffset)
        );
    }

    static fromTsMorphNode(parserNode: ts.Node, parserContext: TypescriptParserContext): TypescriptSyntaxTreeNode {
        // Recursively create TS syntax tree nodes for all the descendants.
        const childNodes = parserNode.getChildren()
            .map(childNode => TypescriptSyntaxTreeNode.fromTsMorphNode(childNode, parserContext));

        const nameOfKind = (kind: ts.SyntaxKind): string =>
            (ts.SyntaxKind)[kind];

        const node = new TypescriptSyntaxTreeNode(
            parserNode.kind ? nameOfKind(parserNode.kind) : "UNKNOWN",
            TypescriptSyntaxTreeNode.computeRangeFromParserNode(parserNode, parserContext),
            childNodes,
            parserNode,
            parserContext.sourceDocument
        );

        return node
    }
}


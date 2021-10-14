import { AstNode } from "../AstNode";
import { ts } from "ts-morph";
import { Range } from "../../documents/Range";
import { TypescriptParserContext } from "./TypescriptParser";

export class TypescriptAstNode extends AstNode {
    readonly type: string;
    readonly range: Range;
    readonly childNodes: TypescriptAstNode[];
    readonly parserNode: ts.Node;

    constructor(type: string, range: Range, childNodes: TypescriptAstNode[], parserNode: ts.Node) {
        super();

        this.type = type;
        this.range  = range;
        this.childNodes = childNodes;
        this.parserNode = parserNode;
    }

    protected static computeRangeFromParserNode(parserNode: ts.Node, parserContext: TypescriptParserContext): Range {
        const startOffset = parserNode.getStart();
        const endOffset = parserNode.getEnd();

        return new Range(
            parserContext.offsetToPositionConverter(startOffset),
            parserContext.offsetToPositionConverter(endOffset)
        );
    }

    static fromTsMorphNode(parserNode: ts.Node, parserContext: TypescriptParserContext): TypescriptAstNode {
        // Recursively create TS AST nodes for all the descendants.
        const childNodes = parserNode.getChildren()
            .map(childNode => TypescriptAstNode.fromTsMorphNode(childNode, parserContext));

        const nameOfKind = (kind: ts.SyntaxKind): string =>
            (ts.SyntaxKind)[kind];

        const node = new TypescriptAstNode(
            parserNode.kind ? nameOfKind(parserNode.kind) : "UNKNOWN",
            TypescriptAstNode.computeRangeFromParserNode(parserNode, parserContext),
            childNodes,
            parserNode
        );

        return node
    }
}


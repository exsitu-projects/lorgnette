import { Position } from "../../documents/Position";
import { Range } from "../../documents/Range";
import { SyntaxTreeNode } from "../SyntaxTreeNode";
import { MarkdownParserContext } from "./MarkdownParser";

export interface ParserNodePosition {
    line: number;
    column: number;
    offset: number;
}

export interface ParserNodeRange {
    start: ParserNodePosition;
    end: ParserNodePosition;
}

export interface ParserNode {
    type: string;
    children?: ParserNode[];
    position: ParserNodeRange;
}

export class MarkdownSyntaxTreeNode extends SyntaxTreeNode {
    readonly type: string;
    readonly range: Range;
    readonly text: string;
    readonly childNodes: MarkdownSyntaxTreeNode[];
    readonly parserNode: ParserNode;

    constructor(type: string, range: Range, text: string, childNodes: MarkdownSyntaxTreeNode[], parserNode: ParserNode) {
        super();

        this.type = type;
        this.range  = range;
        this.text = text;
        this.childNodes = childNodes;
        this.parserNode = parserNode;
    }

    static fromParserNode(parserNode: ParserNode, parserContext: MarkdownParserContext): MarkdownSyntaxTreeNode {
        const type = parserNode.type;
        const range = MarkdownSyntaxTreeNode.getRangeFromParserNode(parserNode);
        const text = parserContext.text.slice(range.start.offset, range.end.offset);
        const childNodes = parserNode.children
            ? parserNode.children.map(
                childParserNode => MarkdownSyntaxTreeNode.fromParserNode(childParserNode, parserContext)
            )
            : [];

        return new MarkdownSyntaxTreeNode(type, range, text, childNodes, parserNode);
    }


    private static getRangeFromParserNode(parserNode: ParserNode): Range {
        const start = parserNode.position.start;
        const end = parserNode.position.end;

        return new Range(
            new Position(start.line - 1, start.column - 1, start.offset),
            new Position(end.line - 1, end.column - 1, end.offset)
        );
    }
}

import { ClassOf } from "../../../utilities/types";
import { Document } from "../../../core/documents/Document";
import { Range } from "../../../core/documents/Range";
import { SyntaxTreeNode } from "../../../core/languages/SyntaxTreeNode";
import { PythonParserContext } from "./PythonParser";

export abstract class PythonSyntaxTreeNode extends SyntaxTreeNode {
    readonly range: Range;
    readonly parserNode: any;

    constructor(parserNode: any, range: Range, sourceDocument: Document) {
        super(sourceDocument);
        this.range = range;
        this.parserNode = parserNode;
    }

    get text(): string {
        return this.parserNode.text;
    }

    is<N extends SyntaxTreeNode, T extends ClassOf<N> & {type: string}>(node: T): this is T {
        return this.type === node.type;
    }

    protected static computeRangeFromParserNode(parserNode: any, parserContext: PythonParserContext): Range {
        return new Range(
            parserContext.offsetToPositionConverter(parserNode.offset),
            parserContext.offsetToPositionConverter(parserNode.endOffset)
        );
    }
}
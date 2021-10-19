import { Position } from "./Position";

export class Range {
    readonly start: Position;
    readonly end: Position;

    constructor(start: Position, end: Position) {
        this.start = start;
        this.end = end;
    }

    // Cannot define this method because of circular dependencies not handled by Webpack?
    // inDocument(document: Document): DocumentRange {
    //     return new DocumentRange(document, this.start, this.end);
    // }

    relativeTo(origin: Position): Range {
        return new Range(
            this.start.relativeTo(origin),
            this.end.relativeTo(origin)
        );
    }

    static fromSinglePosition(position: Position): Range {
        return new Range(position, position);
    }

    static fromOffsetsInText(text: string, startOffset: number, endOffset: number): Range {
        const convertOffsetToPosition = Position.getOffsetToPositionConverterForText(text);
        
        return new Range(
            convertOffsetToPosition(startOffset),
            convertOffsetToPosition(endOffset)
        );
    }
}
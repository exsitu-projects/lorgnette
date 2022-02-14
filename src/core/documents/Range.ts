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

    isEmpty(): boolean {
        return this.start.isEqualTo(this.end);
    }

    contains(position: Position): boolean {
        return this.start.isBefore(position)
            && this.end.isAfter(position);
    }

    relativeTo(origin: Position): Range {
        return new Range(
            this.start.relativeTo(origin),
            this.end.relativeTo(origin)
        );
    }

    toString(): string {
        return `${this.start}–${this.end}`;
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

    static fromUnsortedPositions(position1: Position, position2: Position): Range {
        return position1.isStrictlyBefore(position2)
            ? new Range(position1, position2)
            : new Range(position2, position1);
    }
}
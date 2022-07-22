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

    with(changes: Partial<Range>): Range {
        return new Range(
            changes.start ?? this.start,
            changes.end ?? this.end
        );
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

    toPrettyString(): string {
        return `${this.start.toPrettyString()} → ${this.end.toPrettyString()}`;
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

    static fromLineStartTo(position: Position): Range {
        return new Range(
            position.with({ column: 0, offset: position.offset - position.column }),
            position
        );
    }

    static toLineEndFrom(position: Position, lineLength: number): Range {
        return new Range(
            position,
            position.with({ column: lineLength, offset: position.offset + (lineLength - position.column) }),
        );
    }
}
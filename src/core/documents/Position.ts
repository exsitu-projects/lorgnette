export class Position {
    /* Zero-based row index. */
    readonly row: number;

    /* Zero-based column index. */
    readonly column: number;

    /* Zero-based offset. */
    readonly offset: number;

    constructor(row: number, column: number, offset: number) {
        this.row = row;
        this.column = column;
        this.offset = offset;
    }

    // Cannot define this method because of circular dependencies not handled by Webpack?
    // inDocument(document: Document): DocumentPosition {
    //     return new DocumentPosition(document, this.row, this.column, this.offset);
    // }

    isBefore(otherPosition: Position): boolean {
        return this.offset < otherPosition.offset;
    }

    isBeforeOrEqualTo(otherPosition: Position): boolean {
        return this.offset <= otherPosition.offset;
    }

    isEqualTo(otherPosition: Position): boolean {
        return this.offset === otherPosition.offset;
    }

    isAfterOrEqualTo(otherPosition: Position): boolean {
        return this.offset >= otherPosition.offset;
    }

    isAfter(otherPosition: Position): boolean {
        return this.offset > otherPosition.offset;
    }

    with(changes: Partial<Position>): Position {
        return new Position(
            changes.row ?? this.row,
            changes.column ?? this.column,
            changes.offset ?? this.offset,
        );
    }

    relativeTo(origin: Position): Position {
        return new Position(
            origin.row + this.row,
            origin.column + this.column,
            origin.offset + this.offset,
        );
    }

    shiftBy(row: number, column: number, offset: number): Position {
        return new Position(
            this.row + row,
            this.column + column,
            this.offset + offset,
        );
    }

    toString(): string {
        return `${this.row};${this.column}`;
    }

    toPrettyString(): string {
        return `Ln ${this.row + 1} Col ${this.column + 1}`;
    }
    
    static getOffsetToPositionConverterForText(text: string): (offset: number) => Position {
        // Pre-compute the offsets at the beginning/end of each line of the input.
        const lineEndOffsets = [...text.matchAll(/\n/g)]
            .map(match => match.index!);
        lineEndOffsets.push(text.length);

        const lineStartOffsets = [
            0,
            ...lineEndOffsets.slice(0, -1).map(offset => offset + 1)
        ];

        if (text.endsWith("\n")) {
            lineStartOffsets.push(text.length - 1);
        }

       return (offset: number): Position => {
            const row = lineEndOffsets.findIndex(lineEndOffset => lineEndOffset >= offset);
            const column = offset - lineStartOffsets[row];
            return new Position(row, column, offset);
        }
    }
        
    static getLineAndColumnToPositionConverterForText(text: string): (row: number, column: number) => Position {
        // Pre-compute the offsets of each line of the input.
        const lineStartOffsets = [
            0,
            ...[...text.matchAll(/\n/g)].map(match => match.index! + 1)
        ];

        if (text.endsWith("\n")) {
            lineStartOffsets.push(text.length - 1);
        }

       return (row: number, column: number): Position => {
            const offset = lineStartOffsets[row] + column;
            return new Position(row, column, offset);
        }
    }
}

export const ABSOLUTE_ORIGIN_POSITION = new Position(0, 0, 0);

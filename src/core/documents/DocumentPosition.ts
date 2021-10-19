import { Document } from "./Document";
import { Position } from "./Position";

export class DocumentPosition extends Position {
    readonly document: Document;

    constructor(document: Document, row: number, column: number, offset: number) {
        super(row, column, offset);
        this.document = document;
    }

    relativeTo(origin: Position): DocumentPosition {
        return new DocumentPosition(
            this.document,
            origin.row + this.row,
            origin.column + this.column,
            origin.offset + this.offset,
        );
    }

    static fromPosition(position: Position, document: Document) {
        return new DocumentPosition(document, position.row, position.column, position.offset);
    }
}

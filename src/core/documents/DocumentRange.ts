import { Document } from "./Document";
import { Position } from "./Position";
import { Range } from "./Range";

export class DocumentRange extends Range {
    readonly document: Document;

    constructor(document: Document, start: Position, end: Position) {
        super(start, end);
        this.document = document;
    }

    relativeTo(origin: Position): DocumentRange {
        return new DocumentRange(
            this.document,
            this.start.relativeTo(origin),
            this.end.relativeTo(origin)
        );
    }

    static fromSinglePositionInDocument(document: Document, position: Position): DocumentRange {
        return new DocumentRange(document, position, position);
    }

    static fromOffsetsInDocument(document: Document, startOffset: number, endOffset: number): DocumentRange {
        const convertOffsetToPosition = Position.getOffsetToPositionConverterForText(document.content);
        
        return new DocumentRange(
            document,
            convertOffsetToPosition(startOffset),
            convertOffsetToPosition(endOffset)
        );
    }

    static fromRange(range: Range, document: Document): DocumentRange {
        return new DocumentRange(document, range.start, range.end);
    }
}

import { Document } from "./Document";
import { Position } from "./Position";
import { Range } from "./Range";

export enum DocumentEditKind {
    Insertion,
    Replacement,
    Deletion
}

export class DocumentEdit {
    readonly kind: DocumentEditKind;
    readonly range: Range;
    readonly newContent: string;

    constructor(
        kind: DocumentEditKind,
        range: Range,
        newContent: string = ""
    ) {
        this.kind = kind;
        this.range = range;
        this.newContent = newContent;
    }

    getContentSizeDifferenceInDocument(document: Document): number {
        const getSizeOfContentToEdit = () => document.getContentInRange(this.range).length;

        switch (this.kind) {
            case DocumentEditKind.Insertion:
                return this.newContent.length;

            case DocumentEditKind.Replacement:
                return this.newContent.length - getSizeOfContentToEdit();
        
            case DocumentEditKind.Deletion:
                return -getSizeOfContentToEdit();
        }
    }

    static createInsertion(position: Position, newContent: string): DocumentEdit {
        return new DocumentEdit(
            DocumentEditKind.Insertion,
            Range.fromSinglePosition(position),
            newContent
        );
    }

    static createReplacement(range: Range, newContent: string): DocumentEdit {
        return new DocumentEdit(
            DocumentEditKind.Replacement,
            range,
            newContent
        );
    }

    static createDeletion(range: Range): DocumentEdit {
        return new DocumentEdit(
            DocumentEditKind.Deletion,
            range
        );
    }
}
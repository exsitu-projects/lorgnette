import { Position } from "./Position";
import { Range } from "./Range";

export enum DocumentEditKind {
    Insertion,
    Replacement,
    Deletetion
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
            DocumentEditKind.Deletetion,
            range
        );
    }
}
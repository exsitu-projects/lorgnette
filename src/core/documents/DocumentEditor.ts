import { Position } from "./Position";
import { Range } from "./Range";
import { Document, DocumentChangeContext } from "./Document";
import { DocumentEdit, DocumentEditKind } from "./DocumentEdit";

export class DocumentEditor {
    protected readonly document: Document;
    protected readonly changeContext: DocumentChangeContext;
    protected edits: DocumentEdit[];

    constructor(document: Document, changeContext: DocumentChangeContext) {
        this.document = document;
        this.changeContext = changeContext;
        this.edits = [];
    }

    insert(position: Position, content: string): void {
        this.edits.push(DocumentEdit.createInsertion(position, content));
    }

    replace(range: Range, newContent: string): void {
        this.edits.push(DocumentEdit.createReplacement(range, newContent));
    }

    delete(range: Range): void {
        this.edits.push(DocumentEdit.createDeletion(range));
    }

    reset(): void {
        this.edits = [];
    }

    // TODO: add tests about ranges/positions
    protected applyEdit(edit: DocumentEdit, documentContent: string): string {
        const start = edit.range.start;
        const end = edit.range.end;

        const contentBefore = documentContent.substring(0, start.offset);
        const contentAfter = documentContent.substring(end.offset);

        // console.log("Apply edit:", edit);
        // console.log("range = ", edit.range);
        // console.log("before = ", contentBefore);
        // console.log("new = ", edit.newContent);
        // console.log("after = ", contentAfter);

        switch (edit.kind) {
            case DocumentEditKind.Insertion:
                return `${contentBefore}${edit.newContent}${contentAfter}`;

            case DocumentEditKind.Replacement:
                return `${contentBefore}${edit.newContent}${contentAfter}`;
            
            case DocumentEditKind.Deletetion:
                return `${contentBefore}${contentAfter}`;
        }
    }

    protected getContentToEdit(): string {
        return this.document.content;
    }

    // TODO: improve how edits are sorted/applied
    applyEdits(): void {
        let content = this.getContentToEdit();
        const sortedEdits = this.edits.sort((edit1, edit2) => {
            // TODO: sort better and better handle overlaps
            return edit1.range.start.offset - edit2.range.end.offset;
        });

        for (let edit of sortedEdits.reverse()) {
            content = this.applyEdit(edit, content);
        }

        this.document.setContent(
            content,
            this.changeContext
        );
    }
}
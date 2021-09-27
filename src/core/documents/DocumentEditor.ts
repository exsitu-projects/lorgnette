import { Position } from "./Position";
import { Range } from "./Range";
import { Document, DocumentChangeContext } from "./Document";
import { DocumentEdit, DocumentEditKind } from "./DocumentEdit";

export class DocumentEditor {
    readonly document: Document;
    readonly edits: DocumentEdit[];
    readonly changeContext: DocumentChangeContext;

    constructor(document: Document, changeContext: DocumentChangeContext) {
        this.document = document;
        this.edits = [];
        this.changeContext = changeContext;
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

    // TODO: add tests about ranges/positions
    private applyEdit(edit: DocumentEdit, documentContent: string): string {
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

    // TODO: improve how edits are sorted/applied
    applyEdits(): void {
        let content = this.document.content;
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
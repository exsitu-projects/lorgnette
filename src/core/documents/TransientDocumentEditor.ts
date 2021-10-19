import { Document, DocumentChangeContext, DocumentChangeOrigin } from "./Document";
import { DocumentEditor } from "./DocumentEditor";
import { Range } from "./Range";
// import { Range } from "./Range";

export class TransientDocumentEditor extends DocumentEditor {
    IS_TRANSIENT = true;

    private initialDocumentContent: string;
    // private initialEditableRange: Range;
    // private currentEditableRangeStartOffset: number;
    // private currentEditableRangeEndOffset: number;
    // private initialContentOfEditableRange: string;
    
    constructor(
        document: Document,
        changeContext: DocumentChangeContext
    ) {
        super(document, changeContext);

        this.initialDocumentContent = document.content;
        // this.initialEditableRange = editableRange;
        // this.currentEditableRangeStartOffset = editableRange.start.offset;
        // this.currentEditableRangeEndOffset = editableRange.end.offset;
        // this.initialContentOfEditableRange = document.getContentInRange(editableRange);
    }

    private getPostEditsContentSizeDifference(): number {
        return this.edits.reduce(
            (sum, edit) => sum + edit.getContentSizeDifferenceInDocument(this.document),
            0
        );
    }

    protected getContentToEdit(): string {
        // this.edits.splice(0, this.edits.length)
        return this.initialDocumentContent;
    }

    // applyEdits(): void {
    //     // Before applying the edits, we replace the content of the range that will be edited
    //     // by the initial content of the editable range.
    //     // this.document.setContent(
    //     //     this.initialDocumentContent,
    //     //     { origin: DocumentChangeOrigin.InternalOperation }
    //     // );
        
    //     // this.replace(
    //     //     this.document.range,
    //     //     this.initialDocumentContent
    //     // );

    //     // super.applyEdits();

    //     // Once the edits have been applied, we compute the difference in size
    //     // between the original content of the editable range and the post-edits content.
    // }
}
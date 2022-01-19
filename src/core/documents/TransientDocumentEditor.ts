import { Document, DocumentChangeContext } from "./Document";
import { DocumentEditor } from "./DocumentEditor";

export class TransientDocumentEditor extends DocumentEditor {
    IS_TRANSIENT = true;

    private initialDocumentContent: string;
    
    constructor(
        document: Document,
        changeContext: DocumentChangeContext
    ) {
        super(document, changeContext);
        this.initialDocumentContent = document.content;
    }

    protected getContentToEdit(): string {
        return this.initialDocumentContent;
    }

    restoreInitialContent() {
        this.replace(this.document.range, this.initialDocumentContent);
        this.applyEdits();
    }
}
import { Document } from "../documents/Document";
import { DocumentEditor } from "../documents/DocumentEditor";
import { Range } from "../documents/Range";
import { TemplateSlotTextualValuator, TemplateSlotValue, TemplateSlotValuator, TemplateSlotValuatorProvider } from "./TemplateSlotValuator";

export type TemplateSlotKey = string;

export abstract class TemplateSlot {
    readonly sourceDocument: Document;
    readonly key: TemplateSlotKey;
    protected valuator: TemplateSlotValuator;
    abstract readonly range: Range;

    constructor(
        sourceDocument: Document,
        key: TemplateSlotKey,
        valuatorProvider?: TemplateSlotValuatorProvider
    ) {
        this.sourceDocument = sourceDocument;
        this.key = key;
        this.valuator = valuatorProvider
            ? valuatorProvider.provideValuatorForSlot(this)
            : new TemplateSlotTextualValuator(this);
    }
    
    abstract getText(): string;

    setText(text: string, documentEditor: DocumentEditor): void {
        documentEditor.replace(this.range, text);
    };

    getValue(): TemplateSlotValue {
        return this.valuator.getValue();
    }

    setValue(newValue: TemplateSlotValue, documentEditor: DocumentEditor) {
        this.valuator.setValue(newValue, documentEditor);
    }
}

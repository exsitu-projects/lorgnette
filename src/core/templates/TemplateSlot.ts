import { Document } from "../documents/Document";
import { DocumentEditor } from "../documents/DocumentEditor";
import { Range } from "../documents/Range";
import { TemplateSlotValue, TemplateSlotValuator } from "./valuators/TemplateSlotValuator";
import { TemplateSlotTextualValuator } from "./valuators/TextualTemplateSlotValuator";

export type TemplateSlotKey = string;

export interface TemplateSlotSpecification {
    key: TemplateSlotKey;
    valuator: TemplateSlotValuator;
}

export abstract class TemplateSlot {
    readonly sourceDocument: Document;
    readonly key: TemplateSlotKey;
    protected valuator: TemplateSlotValuator;
    abstract readonly range: Range;

    constructor(
        sourceDocument: Document,
        key: TemplateSlotKey,
        valuator?: TemplateSlotValuator
    ) {
        this.sourceDocument = sourceDocument;
        this.key = key;
        this.valuator = valuator ?? new TemplateSlotTextualValuator();
    }
    
    abstract getText(): string;

    setText(text: string, documentEditor: DocumentEditor): void {
        documentEditor.replace(this.range, text);
    };

    getValue(): TemplateSlotValue {
        return this.valuator.getValueFromSlot(this);
    }

    setValue(newValue: TemplateSlotValue, documentEditor: DocumentEditor) {
        this.valuator.setValueInSlot(this, newValue, documentEditor);
    }
}

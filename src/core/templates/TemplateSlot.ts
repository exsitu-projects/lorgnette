import { Document } from "../documents/Document";
import { DocumentEditor } from "../documents/DocumentEditor";
import { Range } from "../documents/Range";
import { ValuatorValue, Valuator } from "./valuators/Valuator";
import { TextualValuator } from "./valuators/TextualValuator";

export type TemplateSlotKey = string;

export interface TemplateSlotSpecification {
    key: TemplateSlotKey;
    valuator: Valuator;
}

export abstract class TemplateSlot {
    readonly sourceDocument: Document;
    readonly key: TemplateSlotKey;
    protected valuator: Valuator;
    abstract readonly range: Range;

    constructor(
        sourceDocument: Document,
        key: TemplateSlotKey,
        valuator?: Valuator
    ) {
        this.sourceDocument = sourceDocument;
        this.key = key;
        this.valuator = valuator ?? new TextualValuator();
    }
    
    abstract getText(): string;

    setText(text: string, documentEditor: DocumentEditor): void {
        documentEditor.replace(this.range, text);
    };

    getValue(): ValuatorValue {
        return this.valuator.getValueFromSlot(this);
    }

    setValue(newValue: ValuatorValue, documentEditor: DocumentEditor) {
        this.valuator.setValueInSlot(this, newValue, documentEditor);
    }
}

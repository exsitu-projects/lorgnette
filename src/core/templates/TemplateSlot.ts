import { Document } from "../documents/Document";
import { Range } from "../documents/Range";
import { TemplateSlotTextualValuator, TemplateSlotTypedValue, TemplateSlotValuator } from "./TemplateSlotValuator";

export type TemplateSlotKey = string;

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
        this.valuator = valuator ?? new TemplateSlotTextualValuator(this);
    }
    
    abstract getText(): string;
    abstract setText(text: string): void;

    getValue(): TemplateSlotTypedValue {
        return this.valuator.getValue();
    }

    setValue(newTypedValue: TemplateSlotTypedValue) {
        this.valuator.setValue(newTypedValue);
    }
}

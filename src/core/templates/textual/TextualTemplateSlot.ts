import { Document } from "../../documents/Document";
import { Range } from "../../documents/Range";
import { TemplateSlot, TemplateSlotKey } from "../TemplateSlot";
import { TemplateSlotValuator } from "../valuators/TemplateSlotValuator";

export class TextualTemplateSlot extends TemplateSlot {
    private text: string;
    readonly range: Range;

    constructor(
        text: string,
        range: Range,
        sourceDocument: Document,
        key: TemplateSlotKey,
        valuator?: TemplateSlotValuator
    ) {
        super(sourceDocument, key, valuator);

        this.text = text;
        this.range = range;
    }

    getText(): string {
        return this.text;
    }
}

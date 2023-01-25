import { Document } from "../../documents/Document";
import { Range } from "../../documents/Range";
import { TemplateSlot, TemplateSlotKey } from "../TemplateSlot";
import { Valuator } from "../valuators/Valuator";

export class TextualTemplateSlot extends TemplateSlot {
    private text: string;
    readonly range: Range;

    constructor(
        text: string,
        range: Range,
        sourceDocument: Document,
        key: TemplateSlotKey,
        valuator?: Valuator
    ) {
        super(sourceDocument, key, valuator);

        this.text = text;
        this.range = range;
    }

    getText(): string {
        return this.text;
    }
}

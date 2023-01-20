import { Document } from "../../documents/Document";
import { Range } from "../../documents/Range";
import { TemplateSlot, TemplateSlotKey } from "../TemplateSlot";
import { TemplateSlotValuatorProvider } from "../valuators/TemplateSlotValuatorProvider";

export class TextualTemplateSlot extends TemplateSlot {
    private text: string;
    readonly range: Range;

    constructor(
        text: string,
        range: Range,
        sourceDocument: Document,
        key: TemplateSlotKey,
        valuatorProvider?: TemplateSlotValuatorProvider
    ) {
        super(sourceDocument, key, valuatorProvider);

        this.text = text;
        this.range = range;
    }

    getText(): string {
        return this.text;
    }
}

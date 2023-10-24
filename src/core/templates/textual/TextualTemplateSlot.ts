import { Document } from "../../documents/Document";
import { Range } from "../../documents/Range";
import { TemplateSlot, TemplateSlotKey } from "../TemplateSlot";
import { Evaluator } from "../evaluators/Evaluator";

export class TextualTemplateSlot extends TemplateSlot {
    private text: string;
    readonly range: Range;

    constructor(
        text: string,
        range: Range,
        sourceDocument: Document,
        key: TemplateSlotKey,
        evaluator?: Evaluator
    ) {
        super(sourceDocument, key, evaluator);

        this.text = text;
        this.range = range;
    }

    getText(): string {
        return this.text;
    }
}

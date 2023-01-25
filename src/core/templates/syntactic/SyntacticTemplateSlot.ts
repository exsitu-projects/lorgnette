import { Document } from "../../documents/Document";
import { Range } from "../../documents/Range";
import { SyntaxTreeNode } from "../../languages/SyntaxTreeNode";
import { TemplateSlot, TemplateSlotKey } from "../TemplateSlot";
import { TemplateSlotValuator } from "../valuators/TemplateSlotValuator";

// Note: defining the range property as a getter results in an exception,
// because it seems that some code (that I could not identify...)
// attempts to set the "range" property of the slot.
export class SyntacticTemplateSlot extends TemplateSlot {
    readonly node: SyntaxTreeNode;
    readonly range: Range;

    constructor(
        node: SyntaxTreeNode,
        sourceDocument: Document,
        key: TemplateSlotKey,
        valuator?: TemplateSlotValuator
    ) {
        super(sourceDocument, key, valuator);

        this.node = node;
        this.range = node.range;
    }

    getText(): string {
        return this.node.getTextIn(this.sourceDocument);
    }
}

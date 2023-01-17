import { Document } from "../../documents/Document";
import { Range } from "../../documents/Range";
import { SyntaxTreeNode } from "../../languages/SyntaxTreeNode";
import { TemplateSlot, TemplateSlotKey } from "../TemplateSlot";
import { TemplateSlotValuator } from "../TemplateSlotValuator";

export class SyntacticTemplateSlot extends TemplateSlot {
    readonly node: SyntaxTreeNode;

    constructor(
        node: SyntaxTreeNode,
        sourceDocument: Document,
        key: TemplateSlotKey,
        valuator?: TemplateSlotValuator
    ) {
        super(sourceDocument, key, valuator);

        this.node = node;
    }

    get range(): Range {
        return this.node.range;
    }

    getText(): string {
        return this.node.getTextIn(this.sourceDocument);
    }

    setText(text: string): void {
        // TODO
    }
}

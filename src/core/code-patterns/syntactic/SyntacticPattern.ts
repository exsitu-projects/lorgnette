import { SyntaxTreeNode } from "../../languages/SyntaxTreeNode";
import { AbstractPatern } from "../AbstractPattern";
import { DocumentRange } from "../../documents/DocumentRange";
import { Document } from "../../documents/Document";

export class SyntacticPattern extends AbstractPatern {
    readonly node: SyntaxTreeNode;
    readonly document: Document;

    constructor(node: SyntaxTreeNode, document: Document) {
        super();
        this.node = node;
        this.document = document;
    }

    get range(): DocumentRange {
        return DocumentRange.fromRange(this.node.range, this.document);
    }

    get text(): string {
        return this.document.getContentInRange(this.range);
    }
}

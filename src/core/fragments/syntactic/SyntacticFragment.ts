import { SyntaxTreeNode } from "../../languages/SyntaxTreeNode";
import { Fragment } from "../Fragment";
import { DocumentRange } from "../../documents/DocumentRange";
import { Document } from "../../documents/Document";
import { FragmentType } from "../FragmentType";

export class SyntacticFragment implements Fragment {
    readonly type = FragmentType.Syntactic;
    
    private document: Document;
    readonly node: SyntaxTreeNode;
    readonly range: DocumentRange;

    constructor(node: SyntaxTreeNode, document: Document) {
        this.document = document;
        this.node = node;
        this.range = DocumentRange.fromRange(this.node.range, this.document);
    }

    get text(): string {
        return this.document.getContentInRange(this.range);
    }
}

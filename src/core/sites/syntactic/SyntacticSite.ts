import { SyntacticPattern } from "../../code-patterns/syntactic/SyntacticPattern";
import { DocumentRange } from "../../documents/DocumentRange";
import { SyntaxTreeNode } from "../../languages/SyntaxTreeNode";
import { AbstractSite } from "../AbstractSite";

export class SyntacticSite extends AbstractSite {
    readonly pattern: SyntacticPattern;
    readonly node: SyntaxTreeNode;
    readonly range: DocumentRange;

    constructor(node: SyntaxTreeNode, pattern: SyntacticPattern) {
        super();

        this.pattern = pattern;
        this.node = node;
        this.range = DocumentRange.fromRange(node.range, pattern.document);
    }

    get text(): string {
        return this.document.getContentInRange(this.range);
    }
}
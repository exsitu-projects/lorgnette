import { SyntacticPattern } from "../../code-patterns/syntactic/SyntacticPattern";
import { DocumentRange } from "../../documents/DocumentRange";
import { AstNode } from "../../languages/AstNode";
import { AbstractSite } from "../AbstractSite";

export class SyntacticSite extends AbstractSite {
    readonly pattern: SyntacticPattern;
    readonly node: AstNode;
    readonly range: DocumentRange;

    constructor(node: AstNode, pattern: SyntacticPattern) {
        super();

        this.pattern = pattern;
        this.node = node;
        this.range = DocumentRange.fromRange(node.range, pattern.document);
    }

    get text(): string {
        return this.document.getContentInRange(this.range);
    }
}
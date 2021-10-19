import { Document } from "../../documents/Document";
import { Ast } from "../../languages/Ast";
import { AstPattern } from "../../languages/AstPattern";
import { CodeVisualisationType } from "../../visualisations/CodeVisualisationType";
import { PatternFinder } from "../PatternFinder";
import { SyntacticPattern } from "./SyntacticPattern";

export class AstPatternFinder implements PatternFinder<CodeVisualisationType.Syntactic> {
    readonly type = "AST pattern finder";
    private searchPattern: AstPattern;

    constructor(searchPattern: AstPattern) {
        this.searchPattern = searchPattern;
    }

    applyInDocument(document: Document): SyntacticPattern[] {
        return this.searchPattern
            .apply(document.ast)
            .map(node => new SyntacticPattern(node, document));
    }

    updatePattern(pattern: SyntacticPattern, document: Document): SyntacticPattern {
        // TODO: actually do something here...? Or assume the AST is updated in place?
        return pattern;
    }
}
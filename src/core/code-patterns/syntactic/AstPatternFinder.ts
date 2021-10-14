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

    apply(input: Ast): SyntacticPattern[] {
        return this.searchPattern
            .apply(input)
            .map(node => new SyntacticPattern(node));
    }

    updatePattern(pattern: SyntacticPattern, input: Ast): SyntacticPattern {
        // TODO: actually do something here...? Or assume the AST is updated in place?
        return pattern;
    }
}
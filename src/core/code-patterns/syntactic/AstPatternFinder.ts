import { Ast } from "../../languages/Ast";
import { AstPattern } from "../../languages/AstPattern";
import { Range } from "../../documents/Range";
import { CodeVisualisationType } from "../../visualisations/CodeVisualisationType";
import { PatternFinder } from "../PatternFinder";
import { SyntacticPattern } from "./SyntacticPattern";

export class AstPatternFinder implements PatternFinder<CodeVisualisationType.Syntactic> {
    readonly type = "AST pattern finder";
    private searchPattern: AstPattern;

    constructor(searchPattern: AstPattern) {
        this.searchPattern = searchPattern;
    }

    get ranges(): Range[] {
        // TODO
        return [];
    }

    apply(input: Ast): SyntacticPattern[] {
        // TODO
        return []
    }

    updatePattern(pattern: SyntacticPattern, input: Ast): SyntacticPattern {
        // TODO
        throw new Error("Not implemented");
    }
}
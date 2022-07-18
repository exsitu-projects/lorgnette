import { Document } from "../../documents/Document";
import { SyntaxTreePattern } from "../../languages/SyntaxTreePattern";
import { CodeFragmentType } from "../../visualisations/CodeFragmentType";
import { PatternFinder } from "../PatternFinder";
import { SyntacticPattern } from "./SyntacticPattern";

export class SyntacticPatternFinder implements PatternFinder<CodeFragmentType.Syntactic> {
    readonly type = "Syntactic pattern finder";
    private searchPattern: SyntaxTreePattern;

    constructor(searchPattern: SyntaxTreePattern) {
        this.searchPattern = searchPattern;
    }

    applyInDocument(document: Document): SyntacticPattern[] {
        try {
            return this.searchPattern
            .apply(document.syntaxTree)
            .map(node => new SyntacticPattern(node, document));
        }
        catch (error: any) {
            // In case an error happens (e.g., during parsing), return no pattern.
            return [];
        }
    }
}
import { RegexMatcher } from "../../../utilities/RegexMatcher";
import { Document } from "../../documents/Document";
import { CodeVisualisationType } from "../../visualisations/CodeVisualisationType";
import { PatternFinder } from "../PatternFinder";
import { TextualPattern } from "./TextualPattern";

export class RegexPatternFinder implements PatternFinder<CodeVisualisationType.Textual> {
    readonly type = "Regex pattern finder";
    readonly regexMatcher: RegexMatcher;

    constructor(pattern: string) {
        this.regexMatcher = new RegexMatcher(pattern);
    }

    get pattern(): string {
        return this.regexMatcher.pattern;
    }

    set pattern(newPattern: string) {
        this.regexMatcher.pattern = newPattern;
    }

    applyInDocument(document: Document): TextualPattern[] {
        // If the document is empty, there is nothing to do.
        if (document.isEmpty) {
            return [];
        }

        return this.regexMatcher
            .matchAll(document.content)
            .map(match => TextualPattern.fromRegexMatch(match, document));
    }

    updatePattern(pattern: TextualPattern, document: Document): TextualPattern {
        const inputFromPatternStart = document.content.slice(pattern.range.start.offset);
        const match = this.regexMatcher.match(inputFromPatternStart);

        return TextualPattern.fromRegexMatch(match!, document,  pattern.range.start);
    }
}
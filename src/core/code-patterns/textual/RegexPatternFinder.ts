import { RegexMatcher } from "../../../utilities/RegexMatcher";
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

    apply(input: string): TextualPattern[] {
        // if the input is empty, there is nothing to do.
        if (input.length === 0) {
            return [];
        }

        return this.regexMatcher
            .matchAll(input)
            .map(match => TextualPattern.fromRegexMatch(match));
    }

    updatePattern(pattern: TextualPattern, input: string): TextualPattern {
        const inputFromPatternStart = input.slice(pattern.range.start.offset);
        const match = this.regexMatcher.match(inputFromPatternStart);

        return TextualPattern.fromRegexMatch(match!, pattern.range.start);
    }
}
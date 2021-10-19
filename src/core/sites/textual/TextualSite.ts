import { RegexMatch } from "../../../utilities/RegexMatcher";
import { TextualPattern } from "../../code-patterns/textual/TextualPattern";
import { DocumentRange } from "../../documents/DocumentRange";
import { AbstractSite } from "../AbstractSite";

export class TextualSite extends AbstractSite {
    readonly pattern: TextualPattern;
    readonly text: string;
    readonly range: DocumentRange;

    constructor(text: string, range: DocumentRange, pattern: TextualPattern) {
        super();

        this.pattern = pattern;
        this.text = text;
        this.range = range;
    }

    static fromRegexMatch(match: RegexMatch, pattern: TextualPattern): TextualSite {
        return new TextualSite(
            match.value,
            DocumentRange.fromRange(match.range, pattern.document),
            pattern    
        );
    }
}
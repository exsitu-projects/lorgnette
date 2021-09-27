import { RegexMatch } from "../../../utilities/RegexMatcher";
import { Range } from "../../documents/Range";
import { AbstractSite } from "../AbstractSite";

export class TextualSite extends AbstractSite {
    readonly text: string;
    readonly range: Range;

    constructor(text: string, range: Range) {
        super();

        this.text = text;
        this.range = range;
    }

    static fromRegexMatch(match: RegexMatch): TextualSite {
        return new TextualSite(match.value, match.range);
    }
}
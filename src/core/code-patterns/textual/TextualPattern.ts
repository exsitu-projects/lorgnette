import { RegexMatch } from "../../../utilities/RegexMatcher";
import { ABSOLUTE_ORIGIN_POSITION, Position } from "../../documents/Position";
import { Range } from "../../documents/Range";
import { AbstractPatern } from "../AbstractPattern";

export class TextualPattern extends AbstractPatern {
    readonly text: string;
    readonly range: Range;

    constructor(text: string, range: Range) {
        super();
        this.text = text;
        this.range = range;
    }

    static fromRegexMatch(match: RegexMatch, originPosition: Position = ABSOLUTE_ORIGIN_POSITION): TextualPattern {
        return new TextualPattern(
            match.value,
            match.range.relativeTo(originPosition)
        );
    }
}

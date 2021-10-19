import { RegexMatch } from "../../../utilities/RegexMatcher";
import { Document } from "../../documents/Document";
import { DocumentRange } from "../../documents/DocumentRange";
import { ABSOLUTE_ORIGIN_POSITION, Position } from "../../documents/Position";
import { AbstractPatern } from "../AbstractPattern";

export class TextualPattern extends AbstractPatern {
    readonly text: string;
    readonly range: DocumentRange;

    constructor(text: string, range: DocumentRange) {
        super();
        this.text = text;
        this.range = range;
    }

    get document(): Document {
        return this.range.document;
    }

    static fromRegexMatch(match: RegexMatch, document: Document, originPosition: Position = ABSOLUTE_ORIGIN_POSITION): TextualPattern {
        return new TextualPattern(
            match.value,
            DocumentRange.fromRange(match.range.relativeTo(originPosition), document)
        );
    }
}

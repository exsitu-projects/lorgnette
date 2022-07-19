import { RegexMatch } from "../../../utilities/RegexMatcher";
import { Document } from "../../documents/Document";
import { DocumentRange } from "../../documents/DocumentRange";
import { ABSOLUTE_ORIGIN_POSITION, Position } from "../../documents/Position";
import { Fragment } from "../Fragment";
import { FragmentType } from "../FragmentType";

export class TextualFragment implements Fragment {
    readonly type = FragmentType.Textual;
    
    readonly text: string;
    readonly range: DocumentRange;

    constructor(text: string, range: DocumentRange) {
        this.text = text;
        this.range = range;
    }

    static fromRegexMatch(
        match: RegexMatch,
        document: Document,
        originPosition: Position = ABSOLUTE_ORIGIN_POSITION
    ): TextualFragment {
        return new TextualFragment(
            match.value,
            DocumentRange.fromRange(match.range.relativeTo(originPosition), document)
        );
    }
}

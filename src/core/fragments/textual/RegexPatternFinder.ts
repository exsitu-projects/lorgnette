import { RegexMatcher } from "../../../utilities/RegexMatcher";
import { Document } from "../../documents/Document";
import { FragmentProvider } from "../FragmentProvider";
import { FragmentType } from "../FragmentType";
import { TextualFragment } from "./TextualFragment";

export class RegexPatternFinder implements FragmentProvider<TextualFragment> {
    readonly type = FragmentType.Textual;
    private regexMatcher: RegexMatcher;

    constructor(pattern: string) {
        this.regexMatcher = new RegexMatcher(pattern);
    }

    get pattern(): string {
        return this.regexMatcher.pattern;
    }

    set pattern(newPattern: string) {
        this.regexMatcher.pattern = newPattern;
    }

    provideForDocument(document: Document): TextualFragment[] {
        // If the document is empty, there is nothing to do.
        if (document.isEmpty) {
            return [];
        }

        return this.regexMatcher
            .matchAll(document.content)
            .map(match => TextualFragment.fromRegexMatch(match, document));
    }
}
import { RegexMatcher, RegexMatchWithGroups } from "../../../utilities/RegexMatcher";
import { Document } from "../../documents/Document";
import { FragmentProvider } from "../../fragments/FragmentProvider";
import { FragmentType } from "../../fragments/FragmentType";
import { TextualFragment } from "../../fragments/textual/TextualFragment";

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

    async provideFragmentsForDocument(document: Document): Promise<TextualFragment[]> {
        // If the document is empty, there is nothing to do.
        if (document.isEmpty) {
            return [];
        }

        return this.regexMatcher
            .matchAll(document.content)
            .map(match => TextualFragment.fromRegexMatch(match, document));
    }

    provideFragmentsWithMatchesForDocument(document: Document): { fragment: TextualFragment, match: RegexMatchWithGroups }[] {
        // If the document is empty, there is nothing to do.
        if (document.isEmpty) {
            return [];
        }

        return this.regexMatcher
            .matchAllWithGroups(document.content)
            .map(match => {
                return {
                    fragment: TextualFragment.fromRegexMatch(match, document),
                    match: match
                };
            });
    }
}
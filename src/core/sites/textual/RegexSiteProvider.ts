import { RegexMatcher } from "../../../utilities/RegexMatcher";
import { CodeVisualisationType } from "../../visualisations/CodeVisualisationType";
import { SiteProvider } from "../SiteProvider";
import { TextualSite } from "./TextualSite";

export class RegexSiteProvider implements SiteProvider<CodeVisualisationType.Textual> {
    id: string;
    readonly regexMatcher: RegexMatcher;

    constructor(pattern: string) {
        this.id = "new-site";
        this.regexMatcher = new RegexMatcher(pattern);
    }

    provideForPattern(pattern: string): TextualSite | null {
        const match = this.regexMatcher.match(pattern);

        return match
            ? TextualSite.fromRegexMatch(match)
            : null;
    }
}
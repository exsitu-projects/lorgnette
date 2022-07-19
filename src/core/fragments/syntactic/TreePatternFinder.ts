import { Document } from "../../documents/Document";
import { SyntaxTreePattern } from "../../languages/SyntaxTreePattern";
import { FragmentProvider } from "../FragmentProvider";
import { FragmentType } from "../FragmentType";
import { SyntacticFragment } from "./SyntacticFragment";

export class TreePatternFinder implements FragmentProvider<SyntacticFragment> {
    readonly type = FragmentType.Syntactic;
    private searchPattern: SyntaxTreePattern;

    constructor(searchPattern: SyntaxTreePattern) {
        this.searchPattern = searchPattern;
    }

    provideForDocument(document: Document): SyntacticFragment[] {
        try {
            return this.searchPattern
                .apply(document.syntaxTree)
                .map(node => new SyntacticFragment(node, document));
        }
        catch (error: any) {
            // In case an error happens (e.g., during parsing), return an empty list.
            return [];
        }
    }
}
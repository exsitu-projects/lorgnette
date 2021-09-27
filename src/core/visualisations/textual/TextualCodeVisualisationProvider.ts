import { PatternFinder } from "../../code-patterns/PatternFinder";
import { TextualPattern } from "../../code-patterns/textual/TextualPattern";
import { Document } from "../../documents/Document";
import { InputMapping } from "../../mappings/InputMapping";
import { OutputMapping } from "../../mappings/OutputMapping";
import { SiteProvider } from "../../sites/SiteProvider";
import { TextualSite } from "../../sites/textual/TextualSite";
import { UserInterfaceProvider } from "../../user-interfaces/UserInterfaceProvider";
import { AbstractCodeVisualisationProvider } from "../AbstractCodeVisualisationProvider";
import { CodeVisualisation } from "../CodeVisualisation";
import { CodeVisualisationType } from "../CodeVisualisationType";
import { TextualCodeVisualisation } from "./TextualCodeVisualisation";

export class TextualCodeVisualisationProvider extends AbstractCodeVisualisationProvider<CodeVisualisationType.Textual> {
    readonly type = CodeVisualisationType.Textual;
    private cachedCodeVisualisations: CodeVisualisation<CodeVisualisationType.Textual>[];

    constructor(
        name: string,
        patternFinder: PatternFinder<CodeVisualisationType.Textual>,
        siteProviders: SiteProvider<CodeVisualisationType.Textual>[],
        inputMapping: InputMapping<CodeVisualisationType.Textual>,
        outputMapping: OutputMapping<CodeVisualisationType.Textual> | null,
        userInterfaceProvider: UserInterfaceProvider
    ) {
        super(name, patternFinder, siteProviders, inputMapping, outputMapping, userInterfaceProvider);
        this.cachedCodeVisualisations = [];
    }

    get codeVisualisations(): TextualCodeVisualisation[] {
        return [...this.cachedCodeVisualisations];
    }

    provideSitesForPattern(pattern: TextualPattern): TextualSite[] {
        const sites = [];
        for (let siteProvider of this.siteProviders) {
            const siteOrNothing = siteProvider.provideForPattern(pattern.text);
            if (siteOrNothing) {
                sites.push(siteOrNothing);
            }
        }

        return sites;
    }

    updateFromDocument(document: Document): void {
        // Search for code patterns
        const documentContent = document.content;
        const patternFinderResults = this.patternFinder.apply(documentContent);

        this.cachedCodeVisualisations = patternFinderResults
            .map(pattern => {
                const sites = this.provideSitesForPattern(pattern);

                return new TextualCodeVisualisation(
                    this,
                    document,
                    pattern,
                    sites,
                    this.inputMapping,
                    this.outputMapping,
                    this.userInterfaceProvider,
                );
            });
    }
}
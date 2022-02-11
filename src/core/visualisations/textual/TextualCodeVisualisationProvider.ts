import { ClassOf } from "../../../utilities/types";
import { PatternFinder } from "../../code-patterns/PatternFinder";
import { TextualPattern } from "../../code-patterns/textual/TextualPattern";
import { Document } from "../../documents/Document";
import { InputMapping } from "../../mappings/InputMapping";
import { OutputMapping } from "../../mappings/OutputMapping";
import { Renderer } from "../../renderers/Renderer";
import { SiteProvider } from "../../sites/SiteProvider";
import { TextualSite } from "../../sites/textual/TextualSite";
import { UserInterfaceProvider } from "../../user-interfaces/UserInterfaceProvider";
import { AbstractCodeVisualisationProvider } from "../AbstractCodeVisualisationProvider";
import { CodeVisualisation } from "../CodeVisualisation";
import { CodeVisualisationType } from "../CodeVisualisationType";
import { CodeVisualisationUseContext } from "../CodeVisualisationUseContext";
import { TextualCodeVisualisation } from "./TextualCodeVisualisation";

export class TextualCodeVisualisationProvider extends AbstractCodeVisualisationProvider<CodeVisualisationType.Textual> {
    readonly type = CodeVisualisationType.Textual;
    private cachedCodeVisualisations: CodeVisualisation<CodeVisualisationType.Textual>[];

    constructor(
        name: string,
        useContexts: CodeVisualisationUseContext,
        patternFinder: PatternFinder<CodeVisualisationType.Textual>,
        siteProviders: SiteProvider<CodeVisualisationType.Textual>[],
        inputMapping: InputMapping<CodeVisualisationType.Textual>,
        outputMapping: OutputMapping<CodeVisualisationType.Textual> | null,
        userInterfaceProvider: UserInterfaceProvider,
        renderer: ClassOf<Renderer>
    ) {
        super(name, useContexts, patternFinder, siteProviders, inputMapping, outputMapping, userInterfaceProvider, renderer);
        this.cachedCodeVisualisations = [];
    }

    get codeVisualisations(): TextualCodeVisualisation[] {
        return [...this.cachedCodeVisualisations];
    }

    provideSitesForPattern(pattern: TextualPattern): TextualSite[] {
        const sites = [];
        for (let siteProvider of this.siteProviders) {
            const siteOrNothing = siteProvider.provideForPattern(pattern);
            if (siteOrNothing) {
                sites.push(siteOrNothing);
            }
        }

        return sites;
    }

    updateFromDocument(document: Document): void {
        // If this provider cannot be used for the given document, empty the list of visualisations.
        if (!this.canBeUsedInDocument(document)) {
            this.cachedCodeVisualisations = [];
            return;
        }

        // Search for code patterns
        const patternFinderResults = this.patternFinder.applyInDocument(document);

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
                    this.renderer
                );
            });
    }
}
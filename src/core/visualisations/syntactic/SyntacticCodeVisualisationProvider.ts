import { ClassOf } from "../../../utilities/types";
import { PatternFinder } from "../../code-patterns/PatternFinder";
import { SyntacticPattern } from "../../code-patterns/syntactic/SyntacticPattern";
import { Document } from "../../documents/Document";
import { InputMapping } from "../../mappings/InputMapping";
import { OutputMapping } from "../../mappings/OutputMapping";
import { Renderer } from "../../renderers/Renderer";
import { SiteProvider } from "../../sites/SiteProvider";
import { SyntacticSite } from "../../sites/syntactic/SyntacticSite";
import { UserInterfaceProvider } from "../../user-interfaces/UserInterfaceProvider";
import { AbstractCodeVisualisationProvider } from "../AbstractCodeVisualisationProvider";
import { CodeVisualisation } from "../CodeVisualisation";
import { CodeVisualisationType } from "../CodeVisualisationType";
import { CodeVisualisationUseContext } from "../CodeVisualisationUseContext";
import { SyntacticCodeVisualisation } from "./SyntacticCodeVisualisation";

export class SyntacticCodeVisualisationProvider extends AbstractCodeVisualisationProvider<CodeVisualisationType.Syntactic> {
    readonly type = CodeVisualisationType.Syntactic;
    private cachedCodeVisualisations: CodeVisualisation<CodeVisualisationType.Syntactic>[];
    
    constructor(
        name: string,
        useContexts: CodeVisualisationUseContext,
        patternFinder: PatternFinder<CodeVisualisationType.Syntactic>,
        siteProviders: SiteProvider<CodeVisualisationType.Syntactic>[],
        inputMapping: InputMapping<CodeVisualisationType.Syntactic>,
        outputMapping: OutputMapping<CodeVisualisationType.Syntactic> | null,
        userInterfaceProvider: UserInterfaceProvider,
        renderer: ClassOf<Renderer>
    ) {
        super(name, useContexts, patternFinder, siteProviders, inputMapping, outputMapping, userInterfaceProvider, renderer);
        this.cachedCodeVisualisations = [];
    }

    get codeVisualisations(): SyntacticCodeVisualisation[] {
        return [...this.cachedCodeVisualisations];
    }

    provideSitesForPattern(pattern: SyntacticPattern): SyntacticSite[] {
        const sites = [];
        for (let siteProvider of this.siteProviders) {
            const siteOrNothing = siteProvider.provideForPattern(pattern);
            if (siteOrNothing) {
                sites.push(siteOrNothing);
            }
        }

        return sites;
    }

    canBeUsedInDocument(document: Document): boolean {
        // No visualisation can be provided if the document cannot be parsed.
        return super.canBeUsedInDocument(document)
            && document.canBeParsed;
    }

    updateFromDocument(document: Document): void {
        // If this provider cannot be used for the given document, empty the list of visualisations.
        if (!this.canBeUsedInDocument(document)) {
            this.cachedCodeVisualisations = [];
            return;
        }

        // Otherwise, search for code patterns and create one visualisation per pattern.
        const patternFinderResults = this.patternFinder.applyInDocument(document);

        this.cachedCodeVisualisations = patternFinderResults
            .map(pattern => {
                const sites = this.provideSitesForPattern(pattern);
                return new SyntacticCodeVisualisation(
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

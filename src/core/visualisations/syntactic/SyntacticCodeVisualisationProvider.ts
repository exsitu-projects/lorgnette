import { PatternFinder } from "../../code-patterns/PatternFinder";
import { SyntacticPattern } from "../../code-patterns/syntactic/SyntacticPattern";
import { Document } from "../../documents/Document";
import { InputMapping } from "../../mappings/InputMapping";
import { OutputMapping } from "../../mappings/OutputMapping";
import { RendererProvider } from "../../renderers/RendererProvider";
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
        inputMapping: InputMapping<CodeVisualisationType.Syntactic>,
        outputMapping: OutputMapping<CodeVisualisationType.Syntactic> | null,
        userInterfaceProvider: UserInterfaceProvider,
        rendererProvider: RendererProvider
    ) {
        super(name, useContexts, patternFinder, inputMapping, outputMapping, userInterfaceProvider, rendererProvider);
        this.cachedCodeVisualisations = [];
    }

    get codeVisualisations(): SyntacticCodeVisualisation[] {
        return [...this.cachedCodeVisualisations];
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
                return new SyntacticCodeVisualisation(
                    this,
                    document,
                    pattern,
                    this.inputMapping,
                    this.outputMapping,
                    this.userInterfaceProvider,
                    this.rendererProvider.provide()
                );
            });
    }
}

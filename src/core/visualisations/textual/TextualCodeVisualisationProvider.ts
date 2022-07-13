import { PatternFinder } from "../../code-patterns/PatternFinder";
import { TextualPattern } from "../../code-patterns/textual/TextualPattern";
import { Document } from "../../documents/Document";
import { InputMapping } from "../../mappings/InputMapping";
import { OutputMapping } from "../../mappings/OutputMapping";
import { RendererProvider } from "../../renderers/RendererProvider";
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
        inputMapping: InputMapping<CodeVisualisationType.Textual>,
        outputMapping: OutputMapping<CodeVisualisationType.Textual> | null,
        userInterfaceProvider: UserInterfaceProvider,
        rendererProvider: RendererProvider
    ) {
        super(name, useContexts, patternFinder, inputMapping, outputMapping, userInterfaceProvider, rendererProvider);
        this.cachedCodeVisualisations = [];
    }

    get codeVisualisations(): TextualCodeVisualisation[] {
        return [...this.cachedCodeVisualisations];
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
                return new TextualCodeVisualisation(
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
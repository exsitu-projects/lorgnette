import { ClassOf } from "../../utilities/types";
import { Pattern } from "../code-patterns/Pattern";
import { PatternFinder } from "../code-patterns/PatternFinder";
import { Document } from "../documents/Document";
import { InputMapping } from "../mappings/InputMapping";
import { OutputMapping } from "../mappings/OutputMapping";
import { Renderer } from "../renderers/Renderer";
import { RendererProvider } from "../renderers/RendererProvider";
import { UserInterfaceProvider } from "../user-interfaces/UserInterfaceProvider";
import { CodeVisualisation } from "./CodeVisualisation";
import { CodeVisualisationType } from "./CodeVisualisationType";
import { CodeVisualisationUseContext } from "./CodeVisualisationUseContext";

export abstract class AbstractCodeVisualisationProvider<
    T extends CodeVisualisationType = CodeVisualisationType
> {
    readonly abstract type: T;
    name: string;
    useContexts: CodeVisualisationUseContext;

    patternFinder: PatternFinder<T>;
    inputMapping: InputMapping<T>;
    outputMapping: OutputMapping<T> | null;
    userInterfaceProvider: UserInterfaceProvider;
    rendererProvider: RendererProvider;

    constructor(
        name: string,
        useContexts: CodeVisualisationUseContext,
        patternFinder: PatternFinder<T>,
        inputMapping: InputMapping<T>,
        outputMapping: OutputMapping<T> | null,
        userInterfaceProvider: UserInterfaceProvider,
        rendererProvider: RendererProvider
    ) {
        this.name = name;
        this.useContexts = useContexts;

        this.patternFinder = patternFinder;
        this.inputMapping = inputMapping;
        this.outputMapping = outputMapping;
        this.userInterfaceProvider = userInterfaceProvider;
        this.rendererProvider = rendererProvider;
    }

    canBeUsedInDocument(document: Document): boolean {
        // A code visualisation provider should only be used in documents
        // written in a language supported by the code visualisation.
        if (!this.useContexts.languages) {
            return true;
        }

        return this.useContexts.languages.includes(document.language.id);
    }

    abstract get codeVisualisations(): CodeVisualisation<T>[];

    abstract updateFromDocument(document: Document): void;
}
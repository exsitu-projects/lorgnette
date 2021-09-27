import { Pattern } from "../code-patterns/Pattern";
import { PatternFinder } from "../code-patterns/PatternFinder";
import { Document } from "../documents/Document";
import { InputMapping } from "../mappings/InputMapping";
import { OutputMapping } from "../mappings/OutputMapping";
import { Site } from "../sites/Site";
import { SiteProvider } from "../sites/SiteProvider";
import { UserInterfaceProvider } from "../user-interfaces/UserInterfaceProvider";
import { CodeVisualisation } from "./CodeVisualisation";
import { CodeVisualisationType } from "./CodeVisualisationType";

export abstract class AbstractCodeVisualisationProvider<
    T extends CodeVisualisationType = CodeVisualisationType
> {
    readonly abstract type: T;
    name: string;

    patternFinder: PatternFinder<T>;
    siteProviders: SiteProvider<T>[];
    inputMapping: InputMapping<T>;
    outputMapping: OutputMapping<T> | null;
    userInterfaceProvider: UserInterfaceProvider;

    constructor(
        name: string,
        patternFinder: PatternFinder<T>,
        siteProviders: SiteProvider<T>[],
        inputMapping: InputMapping<T>,
        outputMapping: OutputMapping<T> | null,
        userInterfaceProvider: UserInterfaceProvider
    ) {
        this.name = name;

        this.patternFinder = patternFinder;
        this.siteProviders = siteProviders;
        this.inputMapping = inputMapping;
        this.outputMapping = outputMapping;
        this.userInterfaceProvider = userInterfaceProvider;
    }

    abstract get codeVisualisations(): CodeVisualisation<T>[];

    abstract updateFromDocument(document: Document): void;

    abstract provideSitesForPattern(pattern: Pattern<T>): Site<T>[];
}
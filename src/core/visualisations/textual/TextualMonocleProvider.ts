import { PatternFinder } from "../../code-patterns/PatternFinder";
import { Document } from "../../documents/Document";
import { InputMapping } from "../../mappings/InputMapping";
import { EMPTY_OUTPUT_MAPPING, OutputMapping } from "../../mappings/OutputMapping";
import { RendererProvider } from "../../renderers/RendererProvider";
import { UserInterfaceProvider } from "../../user-interfaces/UserInterfaceProvider";
import { CodeFragmentType } from "../CodeFragmentType";
import { MonocleProvider } from "../MonocleProvider";
import { MonocleProviderUsageRequirements } from "../MonocleUsageRequirements";
import { TextualMonocle } from "./TextualMonocle";

export interface TextualMonocleProviderSpecification {
    name: string;

    usageRequirements: MonocleProviderUsageRequirements;

    patternFinder: PatternFinder<CodeFragmentType.Textual>,

    inputMapping: InputMapping<CodeFragmentType.Textual>;

    outputMapping?: OutputMapping<CodeFragmentType.Textual>;

    userInterfaceProvider: UserInterfaceProvider;
    
    rendererProvider: RendererProvider;
}

export class TextualMonocleProvider implements MonocleProvider {
    static readonly type = CodeFragmentType.Textual;
    readonly type = TextualMonocleProvider.type;

    name: string;
    usageRequirements: MonocleProviderUsageRequirements;

    private patternFinder: PatternFinder<CodeFragmentType.Textual>;
    private inputMapping: InputMapping<CodeFragmentType.Textual>;
    private outputMapping: OutputMapping<CodeFragmentType.Textual>;
    private userInterfaceProvider: UserInterfaceProvider;
    private rendererProvider: RendererProvider;

    constructor(specification: TextualMonocleProviderSpecification) {
        this.name = specification.name;
        this.usageRequirements = specification.usageRequirements;
        this.patternFinder = specification.patternFinder;
        this.inputMapping = specification.inputMapping;
        this.outputMapping = specification.outputMapping ?? EMPTY_OUTPUT_MAPPING;
        this.userInterfaceProvider = specification.userInterfaceProvider;
        this.rendererProvider = specification.rendererProvider;
    }
 
    provideForDocument(document: Document): TextualMonocle[] {
        return this.patternFinder
            .applyInDocument(document)
            .map(pattern => {
                return new TextualMonocle(
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
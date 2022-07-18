import { PatternFinder } from "../../code-patterns/PatternFinder";
import { Document } from "../../documents/Document";
import { InputMapping } from "../../mappings/InputMapping";
import { EMPTY_OUTPUT_MAPPING, OutputMapping } from "../../mappings/OutputMapping";
import { RendererProvider } from "../../renderers/RendererProvider";
import { UserInterfaceProvider } from "../../user-interfaces/UserInterfaceProvider";
import { CodeFragmentType } from "../CodeFragmentType";
import { MonocleProvider } from "../MonocleProvider";
import { MonocleProviderUsageRequirements } from "../MonocleUsageRequirements";
import { SyntacticMonocle } from "./SyntacticMonocle";

export interface SyntacticMonocleProviderSpecification {
    name: string;

    usageRequirements: MonocleProviderUsageRequirements;

    patternFinder: PatternFinder<CodeFragmentType.Syntactic>,

    inputMapping: InputMapping<CodeFragmentType.Syntactic>;

    outputMapping?: OutputMapping<CodeFragmentType.Syntactic>;

    userInterfaceProvider: UserInterfaceProvider;
    
    rendererProvider: RendererProvider;
}

export class SyntacticMonocleProvider implements MonocleProvider {
    static readonly type = CodeFragmentType.Syntactic;
    readonly type = SyntacticMonocleProvider.type;

    name: string;
    usageRequirements: MonocleProviderUsageRequirements;

    private patternFinder: PatternFinder<CodeFragmentType.Syntactic>;
    private inputMapping: InputMapping<CodeFragmentType.Syntactic>;
    private outputMapping: OutputMapping<CodeFragmentType.Syntactic>;
    private userInterfaceProvider: UserInterfaceProvider;
    private rendererProvider: RendererProvider;

    constructor(specification: SyntacticMonocleProviderSpecification) {
        this.name = specification.name;
        this.usageRequirements = specification.usageRequirements;
        this.patternFinder = specification.patternFinder;
        this.inputMapping = specification.inputMapping;
        this.outputMapping = specification.outputMapping ?? EMPTY_OUTPUT_MAPPING;
        this.userInterfaceProvider = specification.userInterfaceProvider;
        this.rendererProvider = specification.rendererProvider;
    }
 
    provideForDocument(document: Document): SyntacticMonocle[] {
        return this.patternFinder
            .applyInDocument(document)
            .map(pattern => {
                return new SyntacticMonocle(
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
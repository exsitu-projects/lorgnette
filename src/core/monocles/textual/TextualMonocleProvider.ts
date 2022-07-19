import { FragmentProvider } from "../../fragments/FragmentProvider";
import { Document } from "../../documents/Document";
import { InputMapping } from "../../mappings/InputMapping";
import { EMPTY_OUTPUT_MAPPING, OutputMapping } from "../../mappings/OutputMapping";
import { RendererProvider } from "../../renderers/RendererProvider";
import { UserInterfaceProvider } from "../../user-interfaces/UserInterfaceProvider";
import { MonocleProvider } from "../MonocleProvider";
import { MonocleProviderUsageRequirements } from "../MonocleUsageRequirements";
import { TextualMonocle } from "./TextualMonocle";
import { FragmentType } from "../../fragments/FragmentType";
import { TextualFragment } from "../../fragments/textual/TextualFragment";

export interface TextualMonocleProviderSpecification {
    name: string;

    usageRequirements: MonocleProviderUsageRequirements;

    fragmentProvider: FragmentProvider<TextualFragment>,

    inputMapping: InputMapping<TextualFragment>;

    outputMapping?: OutputMapping<TextualFragment>;

    userInterfaceProvider: UserInterfaceProvider;
    
    rendererProvider: RendererProvider;
}

export class TextualMonocleProvider implements MonocleProvider {
    static readonly type = FragmentType.Textual;
    readonly type = TextualMonocleProvider.type;

    name: string;
    usageRequirements: MonocleProviderUsageRequirements;

    private fragmentProvider: FragmentProvider<TextualFragment>;
    private inputMapping: InputMapping<TextualFragment>;
    private outputMapping: OutputMapping<TextualFragment>;
    private userInterfaceProvider: UserInterfaceProvider;
    private rendererProvider: RendererProvider;

    constructor(specification: TextualMonocleProviderSpecification) {
        this.name = specification.name;
        this.usageRequirements = specification.usageRequirements;
        this.fragmentProvider = specification.fragmentProvider;
        this.inputMapping = specification.inputMapping;
        this.outputMapping = specification.outputMapping ?? EMPTY_OUTPUT_MAPPING;
        this.userInterfaceProvider = specification.userInterfaceProvider;
        this.rendererProvider = specification.rendererProvider;
    }
 
    provideForDocument(document: Document): TextualMonocle[] {
        return this.fragmentProvider
            .provideForDocument(document)
            .map(fragment => {
                return new TextualMonocle(
                    this,
                    document,
                    fragment,
                    this.inputMapping,
                    this.outputMapping,
                    this.userInterfaceProvider,
                    this.rendererProvider.provide()
                );
            });
    }
}
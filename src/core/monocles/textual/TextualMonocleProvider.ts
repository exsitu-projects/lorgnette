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
import { Fragment } from "../../fragments/Fragment";
import { MonocleMatcher } from "../MonocleMatcher";
import { MonocleState } from "../Monocle";
import { RuntimeRequestProvider } from "../../runtime/request-providers/RuntimeRequestProvider";

export interface TextualMonocleProviderSpecification {
    name: string;

    usageRequirements: MonocleProviderUsageRequirements;

    fragmentProvider: FragmentProvider<TextualFragment>,

    runtimeRequestProvider?: RuntimeRequestProvider<TextualFragment>,

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
    private runtimeRequestProvider: RuntimeRequestProvider<TextualFragment> | null;
    private inputMapping: InputMapping<TextualFragment>;
    private outputMapping: OutputMapping<TextualFragment>;
    private userInterfaceProvider: UserInterfaceProvider;
    private rendererProvider: RendererProvider;

    constructor(specification: TextualMonocleProviderSpecification) {
        this.name = specification.name;
        this.usageRequirements = specification.usageRequirements;
        this.fragmentProvider = specification.fragmentProvider;
        this.runtimeRequestProvider = specification.runtimeRequestProvider ?? null;
        this.inputMapping = specification.inputMapping;
        this.outputMapping = specification.outputMapping ?? EMPTY_OUTPUT_MAPPING;
        this.userInterfaceProvider = specification.userInterfaceProvider;
        this.rendererProvider = specification.rendererProvider;
    }

    private createMonocle(document: Document, fragment: TextualFragment, initialState?: MonocleState): TextualMonocle {
        const runtimeRequests = this.runtimeRequestProvider
            ? this.runtimeRequestProvider.provideRuntimeRequests({ document: document, fragment: fragment })
            : [];

        return new TextualMonocle(
            this,
            document,
            fragment,
            runtimeRequests,
            this.inputMapping,
            this.outputMapping,
            this.userInterfaceProvider,
            this.rendererProvider.provide(),
            initialState
        );
    }

    provideForDocument(document: Document, monocleToPreserve?: TextualMonocle): TextualMonocle[] {
        const newFragments = this.fragmentProvider.provideForDocument(document);

        let bestMatchingFragment: Fragment | null = null;
        if (monocleToPreserve) {
            const matcher = new MonocleMatcher(monocleToPreserve)
            bestMatchingFragment = matcher.findBestMatchingFragment(newFragments);
        }

        return newFragments
            .map(fragment => {
                const initialState = fragment === bestMatchingFragment
                    ? monocleToPreserve!.state
                    : undefined;

                return this.createMonocle(document, fragment, initialState);
            });
    }
}

import { FragmentProvider } from "../../fragments/FragmentProvider";
import { Document } from "../../documents/Document";
import { InputMapping } from "../../mappings/InputMapping";
import { EMPTY_OUTPUT_MAPPING, OutputMapping } from "../../mappings/OutputMapping";
import { RendererProvider } from "../../renderers/RendererProvider";
import { UserInterfaceProvider } from "../../user-interfaces/UserInterfaceProvider";
import { MonocleProvider } from "../MonocleProvider";
import { MonocleProviderUsageRequirements } from "../MonocleUsageRequirements";
import { SyntacticMonocle } from "./SyntacticMonocle";
import { FragmentType } from "../../fragments/FragmentType";
import { SyntacticFragment } from "../../fragments/syntactic/SyntacticFragment";
import { MonocleMatcher } from "../MonocleMatcher";
import { Fragment } from "../../fragments/Fragment";
import { MonocleState } from "../Monocle";

export interface SyntacticMonocleProviderSpecification {
    name: string;

    usageRequirements: MonocleProviderUsageRequirements;

    fragmentProvider: FragmentProvider<SyntacticFragment>,

    inputMapping: InputMapping<SyntacticFragment>;

    outputMapping?: OutputMapping<SyntacticFragment>;

    userInterfaceProvider: UserInterfaceProvider;
    
    rendererProvider: RendererProvider;
}

export class SyntacticMonocleProvider implements MonocleProvider {
    static readonly type = FragmentType.Syntactic;
    readonly type = SyntacticMonocleProvider.type;

    name: string;
    usageRequirements: MonocleProviderUsageRequirements;

    private fragmentProvider: FragmentProvider<SyntacticFragment>;
    private inputMapping: InputMapping<SyntacticFragment>;
    private outputMapping: OutputMapping<SyntacticFragment>;
    private userInterfaceProvider: UserInterfaceProvider;
    private rendererProvider: RendererProvider;

    constructor(specification: SyntacticMonocleProviderSpecification) {
        this.name = specification.name;
        this.usageRequirements = specification.usageRequirements;
        this.fragmentProvider = specification.fragmentProvider;
        this.inputMapping = specification.inputMapping;
        this.outputMapping = specification.outputMapping ?? EMPTY_OUTPUT_MAPPING;
        this.userInterfaceProvider = specification.userInterfaceProvider;
        this.rendererProvider = specification.rendererProvider;
    }

    private createMonocle(document: Document, fragment: SyntacticFragment, initialState?: MonocleState): SyntacticMonocle {
        return new SyntacticMonocle(
            this,
            document,
            fragment,
            this.inputMapping,
            this.outputMapping,
            this.userInterfaceProvider,
            this.rendererProvider.provide(),
            initialState
        );
    }

    provideForDocument(document: Document, monocleToPreserve?: SyntacticMonocle): SyntacticMonocle[] {
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

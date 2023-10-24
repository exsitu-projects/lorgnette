import { Document } from "../documents/Document";
import { Fragment } from "../fragments/Fragment";
import { FragmentProvider } from "../fragments/FragmentProvider";
import { BackwardMapping, EMPTY_OUTPUT_MAPPING } from "../mappings/BackwardMapping";
import { ForwardMapping } from "../mappings/ForwardMapping";
import { RendererProvider } from "../renderers/RendererProvider";
import { RuntimeRequestProvider } from "../runtime/request-providers/RuntimeRequestProvider";
import { UserInterfaceProvider } from "../user-interfaces/UserInterfaceProvider";
import { Projection, ProjectionState } from "./Projection";
import { ProjectionMatcher } from "./ProjectionMatcher";
import { ProjectionRequirements } from "./ProjectionRequirements";

export class ProjectionProvider {
    readonly name: string;
    readonly requirements: ProjectionRequirements;
    readonly fragmentProvider: FragmentProvider;
    readonly runtimeRequestProvider: RuntimeRequestProvider | null;
    readonly forwardMapping: ForwardMapping;
    readonly backwardMapping: BackwardMapping;
    readonly userInterfaceProvider: UserInterfaceProvider;
    readonly rendererProvider: RendererProvider;

    constructor(
        name: string,
        requirements: ProjectionRequirements,
        fragmentProvider: FragmentProvider,
        runtimeRequestProvider: RuntimeRequestProvider | null,
        forwardMapping: ForwardMapping,
        backwardMapping: BackwardMapping | null,
        userInterfaceProvider: UserInterfaceProvider,
        rendererProvider: RendererProvider,
    ) {
        this.name = name;
        this.requirements = requirements;
        this.fragmentProvider = fragmentProvider;
        this.runtimeRequestProvider = runtimeRequestProvider;
        this.forwardMapping = forwardMapping;
        this.backwardMapping = backwardMapping ?? EMPTY_OUTPUT_MAPPING;
        this.userInterfaceProvider = userInterfaceProvider;
        this.rendererProvider = rendererProvider;
    }

    private createProjection(document: Document, fragment: Fragment, initialState?: ProjectionState): Projection {
        const runtimeRequests = this.runtimeRequestProvider
            ? this.runtimeRequestProvider.provideRuntimeRequests({ document: document, fragment: fragment })
            : [];

        return new Projection(
            document,
            this,
            fragment,
            runtimeRequests,
            this.forwardMapping,
            this.backwardMapping,
            this.userInterfaceProvider,
            this.rendererProvider.provide(),
            initialState
        );
    }

    async provideForDocument(document: Document, projectionToPreserve?: Projection): Promise<Projection[]> {
        const newFragments = await this.fragmentProvider.provideFragmentsForDocument(document);

        let bestMatchingFragment: Fragment | null = null;
        if (projectionToPreserve) {
            const matcher = new ProjectionMatcher(projectionToPreserve)
            bestMatchingFragment = matcher.findBestMatchingFragment(newFragments);
        }

        return newFragments
            .map(fragment => {
                const initialState = fragment === bestMatchingFragment
                    ? projectionToPreserve!.state
                    : undefined;

                return this.createProjection(document, fragment, initialState);
            });
    }
}

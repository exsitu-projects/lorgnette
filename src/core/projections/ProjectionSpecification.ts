import { Fragment } from "../fragments/Fragment";
import { FragmentProvider } from "../fragments/FragmentProvider";
import { BackwardMapping } from "../mappings/BackwardMapping";
import { ForwardMapping } from "../mappings/ForwardMapping";
import { RendererProvider } from "../renderers/RendererProvider";
import { RendererSettings } from "../renderers/RendererSettings";
import { RuntimeRequestProvider } from "../runtime/request-providers/RuntimeRequestProvider";
import { UserInterfaceProvider } from "../user-interfaces/UserInterfaceProvider";
import { UserInterfaceSettings } from "../user-interfaces/UserInterfaceSettings";
import { ProjectionRequirements } from "./ProjectionRequirements";

export interface ProjectionSpecification<F extends Fragment = Fragment> {
    name: string;
    requirements: ProjectionRequirements;
    pattern: FragmentProvider<F>,
    runtimeRequest?: RuntimeRequestProvider<F>,
    forwardMapping: ForwardMapping<F>;
    backwardMapping?: BackwardMapping<F>;
    userInterface: UserInterfaceSpecification;
    renderer: RendererSpecification;
}

export type UserInterfaceSpecification =
    string |
    UserInterfaceProvider |
    {
        name: string;
        settings: UserInterfaceSettings;
    };

export type RendererSpecification =
    string |
    RendererProvider |
    {
        name: string;
        settings: RendererSettings;
    };

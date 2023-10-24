import { Document } from "../documents/Document";
import { Fragment } from "../fragments/Fragment";
import { RuntimeResponse } from "../runtime/RuntimeResponse";
import { UserInterfaceInput } from "../user-interfaces/UserInterface";

export interface ForwardMappingContext<F extends Fragment = Fragment> {
    fragment: F;
    document: Document;
    runtimeResponses: RuntimeResponse[];
}

export type ForwardMappingFunction<
    F extends Fragment = Fragment,
    I extends UserInterfaceInput = UserInterfaceInput
> = (context: ForwardMappingContext<F>) => I;

export interface ForwardMapping<
    F extends Fragment = Fragment,
    I extends UserInterfaceInput = UserInterfaceInput
> {
    apply: ForwardMappingFunction<F, I>;
}

import { Document } from "../documents/Document";
import { Fragment } from "../fragments/Fragment";
import { RuntimeResponse } from "../runtime/RuntimeResponse";
import { UserInterfaceInput } from "../user-interfaces/UserInterface";

export interface InputMappingContext<F extends Fragment = Fragment> {
    fragment: F;
    document: Document;
    runtimeResponses: RuntimeResponse[];
}

export interface InputMapping<
    F extends Fragment = Fragment,
    I extends UserInterfaceInput = UserInterfaceInput
> {
    processInput(context: InputMappingContext<F>): I;
}
import { Document } from "../documents/Document";
import { Fragment } from "../fragments/Fragment";
import { UserInterfaceInput } from "../user-interfaces/UserInterface";

export interface InputMappingContext<F extends Fragment = Fragment> {
    fragment: F;
    document: Document;
}

export interface InputMapping<
    F extends Fragment = Fragment,
    I extends UserInterfaceInput = UserInterfaceInput
> {
    processInput(context: InputMappingContext<F>): I;
}
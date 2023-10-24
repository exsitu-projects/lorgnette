import { Document } from "../documents/Document";
import { DocumentEditor } from "../documents/DocumentEditor";
import { Fragment } from "../fragments/Fragment";
import { UserInterfaceOutput } from "../user-interfaces/UserInterface";

export interface BackwardMappingContext<
    F extends Fragment = Fragment,
    O extends UserInterfaceOutput = UserInterfaceOutput
> {
    userInterfaceOutput: O;
    fragment: F;
    document: Document;
    documentEditor: DocumentEditor;
}

export type BackwardMappingFunction <
    F extends Fragment = Fragment,
    O extends UserInterfaceOutput = UserInterfaceOutput,
> = (context: BackwardMappingContext<F, O>) => void

export interface BackwardMapping<
    F extends Fragment = Fragment,
    O extends UserInterfaceOutput = UserInterfaceOutput,
> {
    apply: BackwardMappingFunction<F, O>;
}

export const EMPTY_OUTPUT_MAPPING: BackwardMapping = {
    apply() {}
};

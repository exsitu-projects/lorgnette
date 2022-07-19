import { Document } from "../documents/Document";
import { DocumentEditor } from "../documents/DocumentEditor";
import { Fragment } from "../fragments/Fragment";
import { UserInterfaceOutput } from "../user-interfaces/UserInterface";

export interface OutputMappingContext<F extends Fragment = Fragment> {
    fragment: F;
    document: Document;
    documentEditor: DocumentEditor;
}

export interface OutputMapping<
    F extends Fragment = Fragment,
    O extends UserInterfaceOutput = UserInterfaceOutput,
> {
    processOutput(output: O, context: OutputMappingContext<F>): void;
}

export const EMPTY_OUTPUT_MAPPING: OutputMapping = {
    processOutput() {}
}
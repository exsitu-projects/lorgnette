import { Pattern } from "../code-patterns/Pattern";
import { Document } from "../documents/Document";
import { DocumentEditor } from "../documents/DocumentEditor";
import { UserInterfaceOutput } from "../user-interfaces/UserInterface";
import { CodeFragmentType } from "../visualisations/CodeFragmentType";

export interface OutputMappingContext<
    T extends CodeFragmentType = CodeFragmentType
> {
    document: Document;
    documentEditor: DocumentEditor;
    pattern: Pattern<T>;
}

export interface OutputMapping<
    T extends CodeFragmentType = CodeFragmentType,
    O extends UserInterfaceOutput = UserInterfaceOutput,
> {
    processOutput(output: O, context: OutputMappingContext<T>): void;
}

export const EMPTY_OUTPUT_MAPPING: OutputMapping = {
    processOutput() {}
}
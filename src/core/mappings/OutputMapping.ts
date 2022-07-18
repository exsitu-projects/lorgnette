import { Pattern } from "../code-patterns/Pattern";
import { Document } from "../documents/Document";
import { UserInterfaceOutput } from "../user-interfaces/UserInterface";
import { CodeFragmentType } from "../visualisations/CodeFragmentType";

export const EMPTY_OUTPUT_MAPPING: OutputMapping = {
    processOutput() {}
}

export interface OutputMapping<
    T extends CodeFragmentType = CodeFragmentType,
    O extends UserInterfaceOutput = UserInterfaceOutput,
> {
    processOutput(
        output: O,
        document: Document,
        pattern: Pattern<T>
    ): void;
}
import { Pattern } from "../code-patterns/Pattern";
import { Document } from "../documents/Document";
import { UserInterfaceOutput } from "../user-interfaces/UserInterface";
import { CodeVisualisationType } from "../visualisations/CodeVisualisationType";

export interface OutputMapping<
    T extends CodeVisualisationType = CodeVisualisationType,
    O extends UserInterfaceOutput = UserInterfaceOutput,
> {
    processOutput(
        output: O,
        document: Document,
        pattern: Pattern<T>
    ): void;
}
import { Pattern } from "../code-patterns/Pattern";
import { Document } from "../documents/Document";
import { Site } from "../sites/Site";
import { UserInterfaceInput } from "../user-interfaces/UserInterface";
import { CodeVisualisationType } from "../visualisations/CodeVisualisationType";

export interface InputMapping<
    T extends CodeVisualisationType = CodeVisualisationType,
    I extends UserInterfaceInput = UserInterfaceInput
> {
    mapToInput(
        document: Document,
        pattern: Pattern<T>,
        sites: Site<T>[]
    ): I;
}
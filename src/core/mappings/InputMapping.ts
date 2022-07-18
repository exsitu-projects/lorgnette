import { Pattern } from "../code-patterns/Pattern";
import { Document } from "../documents/Document";
import { UserInterfaceInput } from "../user-interfaces/UserInterface";
import { CodeFragmentType } from "../visualisations/CodeFragmentType";

export interface InputMapping<
    T extends CodeFragmentType = CodeFragmentType,
    I extends UserInterfaceInput = UserInterfaceInput
> {
    mapToInput(
        document: Document,
        pattern: Pattern<T>
    ): I;
}
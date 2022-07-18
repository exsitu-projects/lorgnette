import { ProgrammableFunction } from "../../utilities/ProgrammableFunction";
import { Pattern } from "../code-patterns/Pattern";
import { Document } from "../documents/Document";
import { UserInterfaceInput } from "../user-interfaces/UserInterface";
import { CodeFragmentType } from "../visualisations/CodeFragmentType";
import { InputMapping, InputMappingContext } from "./InputMapping";

export type ProgrammableMappingFunction<T extends CodeFragmentType> =
    ((argument: {
        document: Document,
        pattern: Pattern<T>
    }) => UserInterfaceInput);

export class ProgrammableInputMapping<
    T extends CodeFragmentType = CodeFragmentType
> implements InputMapping {
    private programmableFunction: ProgrammableFunction<
        Parameters<ProgrammableMappingFunction<T>>[0],
        ReturnType<ProgrammableMappingFunction<T>>
    >;

    constructor(functionBodyOrRef: string | ProgrammableMappingFunction<T>) {
        this.programmableFunction = new ProgrammableFunction(
            functionBodyOrRef,
            exception => {
                console.error("An exception was caught in a programmable input mapping:", exception);
            }
        );
    }
    
    processInput(context: InputMappingContext<T>): UserInterfaceInput {
        try {
            return this.programmableFunction.call({
                document: context.document,
                pattern: context.pattern
            });
        }
        catch (error) {
            return {};
        }
    }
}

import { ProgrammableFunction } from "../../utilities/ProgrammableFunction";
import { Document } from "../documents/Document";
import { Fragment } from "../fragments/Fragment";
import { RuntimeResponse } from "../runtime/RuntimeResponse";
import { UserInterfaceInput } from "../user-interfaces/UserInterface";
import { InputMapping, InputMappingContext } from "./InputMapping";

export type ProgrammableMappingFunction<F extends Fragment = Fragment> =
    ((argument: {
        document: Document,
        fragment: F,
        runtimeResponses: RuntimeResponse[]
    }) => UserInterfaceInput);

export class ProgrammableInputMapping<
    F extends Fragment = Fragment
> implements InputMapping {
    private programmableFunction: ProgrammableFunction<
        Parameters<ProgrammableMappingFunction<F>>[0],
        ReturnType<ProgrammableMappingFunction<F>>
    >;

    constructor(functionBodyOrRef: string | ProgrammableMappingFunction<F>) {
        this.programmableFunction = new ProgrammableFunction(
            functionBodyOrRef,
            exception => {
                console.error("An exception was caught in a programmable input mapping:", exception);
            }
        );
    }
    
    processInput(context: InputMappingContext<F>): UserInterfaceInput {
        try {
            return this.programmableFunction.call({
                document: context.document,
                fragment: context.fragment,
                runtimeResponses: context.runtimeResponses
            });
        }
        catch (error) {
            return {};
        }
    }
}

import { ProgrammableFunction, ProgrammableFunctionOf, ProgrammableFunctionSource } from "../../utilities/ProgrammableFunction";
import { Document } from "../documents/Document";
import { Fragment } from "../fragments/Fragment";
import { RuntimeResponse } from "../runtime/RuntimeResponse";
import { UserInterfaceInput } from "../user-interfaces/UserInterface";
import { UserInterfaceError, UserInterfaceErrorOrigin } from "../user-interfaces/error/UserInterfaceError";
import { ForwardMapping, ForwardMappingContext, ForwardMappingFunction } from "./ForwardMapping";

export class ProgrammableForwardMapping<
    F extends Fragment = Fragment,
    I extends UserInterfaceInput = UserInterfaceInput
> implements ForwardMapping<F, I> {
    private programmableFunction: ProgrammableFunctionOf<ForwardMappingFunction<F, I>>;

    constructor(source: ProgrammableFunctionSource<ForwardMappingContext<F>, I>) {
        this.programmableFunction = new ProgrammableFunction(
            source,
            exception => {
                console.error("An exception was caught in a programmable forward mapping:", exception);
            }
        );
    }
    
    apply(context: ForwardMappingContext<F>): I {
        try {
            return this.programmableFunction.call(context);
        }
        catch (exception: any) {
            // In case a programmable forward mapping throws, return an empty object.
            return new UserInterfaceError(
                UserInterfaceErrorOrigin.ForwardMapping,
                "Exception thrown by the forward mapping",
                exception.toString()
            ) as I;
        }
    }
}

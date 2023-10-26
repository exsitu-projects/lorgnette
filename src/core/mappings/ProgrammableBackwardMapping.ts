import { ProgrammableFunction, ProgrammableFunctionOf, ProgrammableFunctionSource } from "../../utilities/ProgrammableFunction";
import { Fragment } from "../fragments/Fragment";
import { UserInterfaceOutput } from "../user-interfaces/UserInterface";
import { BackwardMapping, BackwardMappingContext, BackwardMappingFunction } from "./BackwardMapping";

export class ProgrammableBackwardMapping<
    F extends Fragment = Fragment,
    O extends UserInterfaceOutput = UserInterfaceOutput
> implements BackwardMapping<F, O> {
    private programmableFunction: ProgrammableFunctionOf<BackwardMappingFunction<F, O>>;

    constructor(source: ProgrammableFunctionSource<BackwardMappingContext<F, O>, void>) {
        this.programmableFunction = new ProgrammableFunction(
            source,
            exception => {
                console.error("An exception was caught in a programmable backward mapping:", exception);
            }
        );
    }

    apply(context: BackwardMappingContext<F>): void {
        try {
            this.programmableFunction.call(context);
        }
        catch {
            // In case a programmable backward mapping throws, do nothing.
            return;
        }
    }
}


import { ProgrammableFunction } from "../../../utilities/ProgrammableFunction";
import { Fragment } from "../../fragments/Fragment";
import { RuntimeRequest } from "../RuntimeRequest";
import { RuntimeRequestContext, RuntimeRequestProvider } from "./RuntimeRequestProvider";

export type ProgrammableRuntimeRequestProviderFunction<F extends Fragment = Fragment> =
    (context: RuntimeRequestContext<F>) => RuntimeRequest[];

export class ProgrammableRuntimeRequestProvider<
    F extends Fragment = Fragment
> implements RuntimeRequestProvider {
    private programmableFunction: ProgrammableFunction<
        Parameters<ProgrammableRuntimeRequestProviderFunction<F>>[0],
        ReturnType<ProgrammableRuntimeRequestProviderFunction<F>>
    >;

    constructor(functionBodyOrRef: string | ProgrammableRuntimeRequestProviderFunction<F>) {
        this.programmableFunction = new ProgrammableFunction(
            functionBodyOrRef,
            exception => {
                console.error("An exception was caught in a programmable runtime request provider:", exception);
            }
        );
    }

    provideRuntimeRequests(context: RuntimeRequestContext<F>): RuntimeRequest[] {
        try {
            return this.programmableFunction.call({
                document: context.document,
                fragment: context.fragment
            });
        }
        catch (error) {
            return [];
        }
    }
}

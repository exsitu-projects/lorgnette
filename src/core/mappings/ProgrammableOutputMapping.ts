import { ProgrammableFunction, ProgrammableFunctionOf } from "../../utilities/ProgrammableFunction";
import { Document } from "../documents/Document";
import { DocumentEditor } from "../documents/DocumentEditor";
import { Fragment } from "../fragments/Fragment";
import { UserInterfaceOutput } from "../user-interfaces/UserInterface";
import { OutputMapping, OutputMappingContext } from "./OutputMapping";

export type MappingFunction<F extends Fragment = Fragment> =
    ((argument: {
        output: UserInterfaceOutput,
        document: Document,
        documentEditor: DocumentEditor
        fragment: F
    }) => void);

export class ProgrammableOutputMapping<
F extends Fragment = Fragment
> implements OutputMapping {
    private programmableFunction: ProgrammableFunctionOf<MappingFunction<F>>;

    constructor(functionBodyOrRef: string | MappingFunction<F>) {
        this.programmableFunction = new ProgrammableFunction(
            functionBodyOrRef,
            exception => {
                console.error("An exception was caught in a programmable output mapping:", exception);
            }
        );
    }

    processOutput(
        output: UserInterfaceOutput,
        context: OutputMappingContext<F>
    ): void {
        try {
            this.programmableFunction.call({
                output: output,
                document: context.document,
                documentEditor: context.documentEditor,
                fragment: context.fragment
            });
        }
        catch {
            return;
        }
    }
}

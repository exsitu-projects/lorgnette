import { ProgrammableFunction, ProgrammableFunctionOf } from "../../utilities/ProgrammableFunction";
import { Pattern } from "../code-patterns/Pattern";
import { Document } from "../documents/Document";
import { DocumentEditor } from "../documents/DocumentEditor";
import { UserInterfaceOutput } from "../user-interfaces/UserInterface";
import { CodeFragmentType } from "../visualisations/CodeFragmentType";
import { OutputMapping, OutputMappingContext } from "./OutputMapping";

export type MappingFunction<T extends CodeFragmentType> =
    ((argument: {
        output: UserInterfaceOutput,
        document: Document,
        documentEditor: DocumentEditor
        pattern: Pattern<T>
    }) => void);

export class ProgrammableOutputMapping<
    T extends CodeFragmentType = CodeFragmentType
> implements OutputMapping {
    private programmableFunction: ProgrammableFunctionOf<MappingFunction<T>>;

    constructor(functionBodyOrRef: string | MappingFunction<T>) {
        this.programmableFunction = new ProgrammableFunction(
            functionBodyOrRef,
            exception => {
                console.error("An exception was caught in a programmable output mapping:", exception);
            }
        );
    }

    processOutput(
        output: UserInterfaceOutput,
        context: OutputMappingContext<T>
    ): void {
        try {
            this.programmableFunction.call({
                output: output,
                document: context.document,
                documentEditor: context.documentEditor,
                pattern: context.pattern
            });
        }
        catch {
            return;
        }
    }
}

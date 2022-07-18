import { ProgrammableFunction } from "../../utilities/ProgrammableFunction";
import { Pattern } from "../code-patterns/Pattern";
import { Document } from "../documents/Document";
import { UserInterfaceOutput } from "../user-interfaces/UserInterface";
import { CodeFragmentType } from "../visualisations/CodeFragmentType";
import { OutputMapping } from "./OutputMapping";

export type ProgrammableMappingFunction<T extends CodeFragmentType> =
    ((arg: {
        output: UserInterfaceOutput,
        document: Document,
        pattern: Pattern<T>
    }) => void);

export class ProgrammableOutputMapping<T extends CodeFragmentType = CodeFragmentType> implements OutputMapping {
    private programmableFunction: ProgrammableFunction<
        Parameters<ProgrammableMappingFunction<T>>[0],
        ReturnType<ProgrammableMappingFunction<T>>
    >;

    constructor(functionBodyOrRef: string | ProgrammableMappingFunction<T>) {
        this.programmableFunction = new ProgrammableFunction(functionBodyOrRef);
    }

    // TODO: somehow move the editor back in here...?
    processOutput(
        output: UserInterfaceOutput,
        document: Document,
        pattern: Pattern<T>
    ): void {
        try {
            this.programmableFunction.call({
                output: output,
                document: document,
                // documentEditor: document.createEditor({
                //     origin: DocumentChangeOrigin.CodeVisualisationEdit,
                //     isTransientChange: output.context.isTransientState,
                //     visualisation: output.context.visualisation
                // }),
                pattern: pattern
            });
        }
        catch {
            // TODO: deal with the error
            return;
        }
    }
}

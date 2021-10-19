import { ProgrammableFunction } from "../../utilities/ProgrammableFunction";
import { Pattern } from "../code-patterns/Pattern";
import { Document, DocumentChangeOrigin } from "../documents/Document";
import { Site } from "../sites/Site";
import { UserInterfaceInput, UserInterfaceOutput } from "../user-interfaces/UserInterface";
import { CodeVisualisationType } from "../visualisations/CodeVisualisationType";
import { InputMapping } from "./InputMapping";
import { OutputMapping } from "./OutputMapping";

export type ProgrammableMappingFunction<T extends CodeVisualisationType> =
    ((arg: {
        output: UserInterfaceOutput,
        document: Document,
        pattern: Pattern<T>,
        sites: Site<T>[]
    }) => void);

export class ProgrammableOutputMapping<T extends CodeVisualisationType = CodeVisualisationType> implements OutputMapping {
    private programmableFunction: ProgrammableFunction<
        Parameters<ProgrammableMappingFunction<T>>[0],
        ReturnType<ProgrammableMappingFunction<T>>
    >;

    constructor(functionBodyOrRef: string | ProgrammableMappingFunction<T>) {
        this.programmableFunction = new ProgrammableFunction(functionBodyOrRef);
    }

    // TODO: somehow move the editor back in here...?
    processOutput(output: UserInterfaceOutput, document: Document, pattern: Pattern<T>, sites: Site<T>[]): void {
        try {
            this.programmableFunction.call({
                output: output,
                document: document,
                // documentEditor: document.createEditor({
                //     origin: DocumentChangeOrigin.CodeVisualisationEdit,
                //     isTransientChange: output.context.isTransientState,
                //     visualisation: output.context.visualisation
                // }),
                pattern: pattern,
                sites: sites
            });
        }
        catch {
            // TODO: deal with the error
            return;
        }
    }
}

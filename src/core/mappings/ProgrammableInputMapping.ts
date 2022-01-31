import { ProgrammableFunction } from "../../utilities/ProgrammableFunction";
import { Pattern } from "../code-patterns/Pattern";
import { Document } from "../documents/Document";
import { Site } from "../sites/Site";
import { UserInterfaceInput } from "../user-interfaces/UserInterface";
import { CodeVisualisationType } from "../visualisations/CodeVisualisationType";
import { InputMapping } from "./InputMapping";

export type ProgrammableMappingFunction<T extends CodeVisualisationType> =
    ((arg: {
        document: Document,
        pattern: Pattern<T>,
        sites: Site<T>[]
    }) => UserInterfaceInput);

export class ProgrammableInputMapping<T extends CodeVisualisationType = CodeVisualisationType> implements InputMapping {
    private programmableFunction: ProgrammableFunction<
        Parameters<ProgrammableMappingFunction<T>>[0],
        ReturnType<ProgrammableMappingFunction<T>>
    >;

    constructor(functionBodyOrRef: string | ProgrammableMappingFunction<T>) {
        this.programmableFunction = new ProgrammableFunction(functionBodyOrRef);
    }
    
    mapToInput(
        document: Document,
        pattern: Pattern<T>,
        sites: Site<T>[]
    ): UserInterfaceInput {
        try {
            return this.programmableFunction.call({
                document: document,
                pattern: pattern,
                sites: sites
            });
        }
        catch (error) {
            // TODO: deal with the error
            return {};
        }
    }
}

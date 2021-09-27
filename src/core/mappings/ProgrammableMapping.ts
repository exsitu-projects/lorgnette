import { Pattern } from "../code-patterns/Pattern";
import { Document, DocumentChangeOrigin } from "../documents/Document";
import { Site } from "../sites/Site";
import { UserInterfaceInput, UserInterfaceOutput } from "../user-interfaces/UserInterface";
import { CodeVisualisationType } from "../visualisations/CodeVisualisationType";
import { InputMapping } from "./InputMapping";
import { OutputMapping } from "./OutputMapping";


export class ProgrammableMapping<T extends CodeVisualisationType = CodeVisualisationType> implements InputMapping, OutputMapping {
    private functionBody: string;

    constructor(functionBody: string) {
        this.functionBody = functionBody;
    }

    private createMappingFunction(): Function {
        // eslint-disable-next-line
        return new Function("args", 
        `
            try {
                ${this.functionBody}
            } catch (error) {
                console.error("An error occured in a programmable mapping:", error);
            }
        `);
    }
    
    mapToInput(pattern: Pattern<T>, sites: Site<T>[]): UserInterfaceInput {
        const mappingFunction = this.createMappingFunction();

        try {
            return mappingFunction({
                pattern: pattern,
                sites: sites
            });
        }
        catch (error) {
            // TODO: deal with the error
            return {};
        }
    }

    processOutput(output: UserInterfaceOutput, document: Document, pattern: Pattern<T>, sites: Site<T>[]): void {
        const mappingFunction = this.createMappingFunction();

        try {
            mappingFunction({
                output: output,
                document: document,
                documentEditor: document.createEditor({
                    origin: DocumentChangeOrigin.CodeVisualisationEdit,
                    isTransientChange: output.context.isTransientState,
                    visualisation: output.context.visualisation
                }),
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
import React from "react";
import { CodeVisualisation } from "../../visualisations/CodeVisualisation";
import { UserInterface, UserInterfaceOutput } from "../UserInterface";
import { InputPrinterComponent } from "./InputPrinterComponent";

export type Input = any;
export interface Output extends UserInterfaceOutput {};

export class InputPrinter extends UserInterface<Input, Output> {
    readonly className = "input-printer";
    private input: any;

    constructor(visualisation: CodeVisualisation) {
        super(visualisation);

        this.input = "";
    }

    setInput(newInput: any): void {
        this.input = newInput;
    }

    createViewContent(): JSX.Element {
        return <InputPrinterComponent
            input={this.input}
        />;
    }

    protected get modelOutput(): Output {
        return {
            ...this.getPartialModelOutput(),
            data: {}
        };
    }

    updateModel(input: Input): void {
        // TODO: check input
        this.setInput(input);
    }
}
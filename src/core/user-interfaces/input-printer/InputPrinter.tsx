import React from "react";
import { Monocle } from "../../monocles/Monocle";
import { UserInterface, UserInterfaceOutput } from "../UserInterface";
import { UserInterfaceProvider } from "../UserInterfaceProvider";
import { InputPrinterComponent } from "./InputPrinterComponent";

export type Input = any;
export interface Output extends UserInterfaceOutput {};

export class InputPrinter extends UserInterface<Input, Output> {
    readonly className = "input-printer";
    private input: any;

    constructor(monocle: Monocle) {
        super(monocle);

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
        return {};
    }

    updateModel(input: Input): void {
        // TODO: check input
        this.setInput(input);
    }

    static makeProvider(): UserInterfaceProvider {
        return {
            provideForMonocle: (monocle: Monocle): UserInterface<Input, Output> => {
                return new InputPrinter(monocle);
            }
        };
    }
}
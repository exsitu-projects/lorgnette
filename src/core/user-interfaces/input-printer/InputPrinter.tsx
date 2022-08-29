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
    private component: InputPrinterComponent | null;

    constructor(monocle: Monocle) {
        super(monocle);

        this.input = {};
        this.component = null;
    }

    setInput(newInput: any): void {
        this.input = newInput;
        this.updateViewContent();
    }

    createViewContent(): JSX.Element {
        return <InputPrinterComponent
            initialInput={this.input}
            ref={component => this.component = component}
        />;
    }

    updateViewContent(): void {
        if (!this.component) {
            return;
        }

        this.component.setState({
            input: this.input
        });
    }

    protected get modelOutput(): Output {
        return {};
    }

    updateModel(input: Input): void {
        // TODO: check input
        this.setInput(input);
        console.log("Updated input printer model with:", input);
    }

    static makeProvider(): UserInterfaceProvider {
        return {
            provideForMonocle: (monocle: Monocle): UserInterface<Input, Output> => {
                return new InputPrinter(monocle);
            }
        };
    }
}
import React from "react";
import { CodeVisualisation } from "../../visualisations/CodeVisualisation";
import { UserInterface, UserInterfaceOutput } from "../UserInterface";
import { RegexEditorComponent } from "./RegexEditorComponent";

export type Input = { regex: RegExp };
export interface Output extends UserInterfaceOutput {
    data: {
        regex: RegExp;
    }
};

export class RegexEditor extends UserInterface<Input, Output> {
    private regex: RegExp;

    constructor(visualisation: CodeVisualisation) {
        super(visualisation);
        this.regex = RegExp("");
    }

    setInput(newInput: Input): void {
        this.regex = newInput.regex;
    }

    createView(): JSX.Element {
        return <RegexEditorComponent
            regex={this.regex}
            onChange={(regexContent, regexFlags) => {
                this.regex = new RegExp(regexContent, regexFlags);
                this.declareModelChange();
            }}
        />;
    }

    protected get modelOutput(): Output {
        return {
            ...this.getPartialModelOutput(),
            data: {
                regex: this.regex
            },
        };
    }

    updateModel(input: Input): void {
        // TODO: check input
        this.setInput(input);
    }
}
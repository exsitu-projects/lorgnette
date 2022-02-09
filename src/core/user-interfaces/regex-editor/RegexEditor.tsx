import React from "react";
import { Range } from "../../documents/Range";
import { CodeVisualisation } from "../../visualisations/CodeVisualisation";
import { UserInterface, UserInterfaceOutput } from "../UserInterface";
import { RegexEditorComponent } from "./RegexEditorComponent";

export type Input = {
    regex: RegExp;
    range?: Range;
};

export interface Output extends UserInterfaceOutput {
    data: {
        regex: RegExp;
    }
};

export class RegexEditor extends UserInterface<Input, Output> {
    readonly className = "regex-editor";

    private regex: RegExp;
    private regexRange: Range | null;

    constructor(visualisation: CodeVisualisation) {
        super(visualisation);

        this.regex = RegExp("");
        this.regexRange = null;
    }

    setInput(newInput: Input): void {
        this.regex = newInput.regex;
        this.regexRange = newInput.range ?? null;
    }

    createViewContent(): JSX.Element {
        return <RegexEditorComponent
            regex={this.regex}
            regexRange={this.regexRange}
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
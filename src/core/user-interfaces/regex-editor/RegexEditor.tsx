import React from "react";
import { Range } from "../../documents/Range";
import { CodeVisualisation } from "../../visualisations/CodeVisualisation";
import { UserInterface, UserInterfaceOutput } from "../UserInterface";
import { RegexEditorComponent } from "./RegexEditorComponent";
import { RegexEditorPopupComponent } from "./RegexEditorPopupComponent";

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
    private withPopup: boolean;

    constructor(visualisation: CodeVisualisation, withPopup: boolean = false) {
        super(visualisation);

        this.regex = RegExp("");
        this.regexRange = null;
        this.withPopup = withPopup;
    }

    setInput(newInput: Input): void {
        this.regex = newInput.regex;
        this.regexRange = newInput.range ?? null;
    }

    createViewContent(): JSX.Element {
        const props = {
            regex: this.regex,
            regexRange: this.regexRange,
            onChange: (regexContent: string, regexFlags: string) => {
                this.regex = new RegExp(regexContent, regexFlags);
                this.declareModelChange();
            }
        };

        return this.withPopup
            ? <RegexEditorPopupComponent {...props} />
            : <RegexEditorComponent {...props} />;
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
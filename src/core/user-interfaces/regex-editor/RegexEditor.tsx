import React from "react";
import { Range } from "../../documents/Range";
import { Monocle } from "../../visualisations/Monocle";
import { UserInterface, UserInterfaceInput, UserInterfaceOutput } from "../UserInterface";
import { UserInterfaceProvider } from "../UserInterfaceProvider";
import { RegexEditorComponent } from "./RegexEditorComponent";
import { RegexEditorPopupComponent } from "./RegexEditorPopupComponent";

export interface Input extends UserInterfaceInput {
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

    constructor(monocle: Monocle, withPopup: boolean = false) {
        super(monocle);

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

    static makeProvider(withPopup: boolean = false): UserInterfaceProvider {
        return {
            provideForMonocle: (monocle: Monocle): UserInterface<Input, Output> => {
                return new RegexEditor(monocle, withPopup);
            }
        };
    }
}
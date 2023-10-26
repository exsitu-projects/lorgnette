
import { Range } from "../../../core/documents/Range";
import { Projection } from "../../../core/projections/Projection";
import { UserInterface, UserInterfaceInput, UserInterfaceOutput } from "../../../core/user-interfaces/UserInterface";
import { ConfigurableUserInterfaceProvider } from "../../../core/user-interfaces/UserInterfaceProvider";
import { RegexEditorComponent } from "./RegexEditorComponent";
import { UserInterfaceSettings } from "../../../core/user-interfaces/UserInterfaceSettings";

export interface Input extends UserInterfaceInput {
    regex: RegExp;
    range?: Range;
}

export interface Output extends UserInterfaceOutput {
    regex: RegExp;
}

export class RegexEditor extends UserInterface<Input, Output> {
    readonly className = "regex-editor";

    private regex: RegExp;
    private regexRange: Range | null;

    constructor(projection: Projection) {
        super(projection);

        this.regex = RegExp("");
        this.regexRange = null;
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

        return <RegexEditorComponent {...props} />;
    }

    protected get modelOutput(): Output {
        return {
            regex: this.regex
        };
    }

    protected processInput(input: Input): void {
        // TODO: check input
        this.setInput(input);
    }

    static makeConfigurableProvider(): ConfigurableUserInterfaceProvider {
        return (settings: Partial<UserInterfaceSettings> = {}) => {
            return {
                provide: (projection: Projection) => {
                    return new RegexEditor(projection);
                }
            };  
        };
    }
}
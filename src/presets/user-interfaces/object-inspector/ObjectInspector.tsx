
import { Projection } from "../../../core/projections/Projection";
import { UserInterface, UserInterfaceOutput } from "../../../core/user-interfaces/UserInterface";
import { ConfigurableUserInterfaceProvider } from "../../../core/user-interfaces/UserInterfaceProvider";
import { ObjectInspectorComponent } from "./ObjectInspectorComponent";
import { UserInterfaceSettings } from "../../../core/user-interfaces/UserInterfaceSettings";

export type Input = any;
export interface Output extends UserInterfaceOutput {}

export class ObjectInspector extends UserInterface<Input, Output> {
    readonly className = "object-inspector";
    private input: any;
    private component: ObjectInspectorComponent | null;

    constructor(projection: Projection) {
        super(projection);

        this.input = {};
        this.component = null;
    }

    setInput(newInput: any): void {
        this.input = newInput;
        this.updateViewContent();
    }

    createViewContent(): JSX.Element {
        return <ObjectInspectorComponent
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

    protected processInput(input: Input): void {
        // TODO: check input
        this.setInput(input);
        console.log("Updated object inspector model with:", input);
    }

    static makeConfigurableProvider(): ConfigurableUserInterfaceProvider {
        return (settings: Partial<UserInterfaceSettings> = {}) => {
            return {
                provide: (projection: Projection) => {
                    return new ObjectInspector(projection);
                }
            };  
        };
    }
}
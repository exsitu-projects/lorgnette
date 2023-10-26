import { Projection } from "../../../core/projections/Projection";
import { UserInterface, UserInterfaceOutput } from "../../../core/user-interfaces/UserInterface";
import { ConfigurableUserInterfaceProvider } from "../../../core/user-interfaces/UserInterfaceProvider";
import { ValueHistoryComponent } from "./ValueHistoryComponent";
import { deriveValueHistorySettingsFrom, ValueHistorySettings } from "./ValueHistorySettings";

export type Value = number | string;

export type TimestampedValue<V extends Value = Value> = {
    value: V;
    timestamp: number;
};

export type Input = {
    valueChanges: TimestampedValue[];
};

export interface Output extends UserInterfaceOutput {}

export class ValueHistory extends UserInterface<Input, Output> {
    readonly className = "value-history";

    private component: ValueHistoryComponent | null;
    private settings: ValueHistorySettings;

    constructor(projection: Projection, settings: ValueHistorySettings) {
        super(projection);

        this.component = null;
        this.settings = settings;
    }

    createViewContent(): JSX.Element {
        return <ValueHistoryComponent
            // initialValue={this.input}
            maximumNbValues={this.settings.maximumNbValues}
            ref={component => this.component = component}
        />;
    }

    updateViewContent(valueChange: TimestampedValue): void {
        if (!this.component) {
            return;
        }

        this.component.addValueChange(valueChange);
    }

    protected get modelOutput(): Output {
        return {};
    }

    protected processInput(input: Input): void {
        for (let change of input.valueChanges) {
            const valueAsNumberOrString = typeof change.value === "number"
            ? change.value
            : change.value.toString();

            this.updateViewContent({
                timestamp: change.timestamp,
                value: valueAsNumberOrString
            });
        }
    }

    static makeConfigurableProvider(): ConfigurableUserInterfaceProvider {
        return (settings: Partial<ValueHistorySettings> = {}) => {
            return {
                provide: (projection: Projection) => {
                    return new ValueHistory(
                        projection,
                        deriveValueHistorySettingsFrom(settings)
                    );
                }
            };  
        };
    }
}
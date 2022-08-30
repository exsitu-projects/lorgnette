import React from "react";
import { Monocle } from "../../monocles/Monocle";
import { UserInterface, UserInterfaceOutput } from "../UserInterface";
import { UserInterfaceProvider } from "../UserInterfaceProvider";
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

export interface Output extends UserInterfaceOutput {};

export class ValueHistory extends UserInterface<Input, Output> {
    readonly className = "value-history";

    private component: ValueHistoryComponent | null;
    private settings: ValueHistorySettings;

    constructor(monocle: Monocle, settings: ValueHistorySettings) {
        super(monocle);

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

    updateModel(input: Input): void {
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

    static makeProvider(settings: Partial<ValueHistorySettings> = {}): UserInterfaceProvider {
        return {
            provideForMonocle: (monocle: Monocle): UserInterface<Input, Output> => {
                return new ValueHistory(
                    monocle,
                    deriveValueHistorySettingsFrom(settings)
                );
            }
        };
    }
}
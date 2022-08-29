import React from "react";
import { Monocle } from "../../monocles/Monocle";
import { UserInterface, UserInterfaceOutput } from "../UserInterface";
import { UserInterfaceProvider } from "../UserInterfaceProvider";
import { ValueHistoryComponent } from "./ValueHistoryComponent";

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

    constructor(monocle: Monocle) {
        super(monocle);
        this.component = null;
    }

    createViewContent(): JSX.Element {
        return <ValueHistoryComponent
            // initialValue={this.input}
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

    static makeProvider(): UserInterfaceProvider {
        return {
            provideForMonocle: (monocle: Monocle): UserInterface<Input, Output> => {
                return new ValueHistory(monocle);
            }
        };
    }
}
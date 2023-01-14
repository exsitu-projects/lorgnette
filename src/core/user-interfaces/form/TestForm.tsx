import React, { ReactElement } from "react";
import { Monocle } from "../../monocles/Monocle";
import { UserInterface } from "../UserInterface";
import { UserInterfaceProvider } from "../UserInterfaceProvider";
import { Form, Input, Output } from "./Form";
import { NumberInput } from "./form-elements/NumberInput";
import { Select } from "./form-elements/Select";
import { StringInput } from "./form-elements/StringInput";
import { Switch } from "./form-elements/Switch";

export class TestForm extends Form {
    protected title = "Test form";

    protected createFormBody(): ReactElement {
        return <>
            <h4 style={{ textAlign: "center" }}>Test form</h4>
            Some text introducing the purpose of this form and explaining some details.<br/>
            <NumberInput formEntryKey="a" label="Some number" />
            <StringInput formEntryKey="b" label="Some string" />
            Some text explaining the purpose of the next form element.<br/>
            <Switch formEntryKey="e" label="Some boolean" />
            <Select formEntryKey="d" items={["foo", "bar"]} />
            Some conclusive text...<br/>
        </>;
    }

    static makeProvider(): UserInterfaceProvider {
        return {
            provideForMonocle: (monocle: Monocle): UserInterface<Input, Output> => {
                return new TestForm(monocle);
            }
        };
    }
}

import { Color, } from "../../utilities/Color";
import { JsonObjectTemplate } from "../../utilities/languages/json/JsonObjectTemplate";
import { createSlotSpecification, FORM_DATA_TEMPLATE_TRANSFORMERS } from "../user-interfaces/form/template-form-utilities";
import { FormEntryType } from "../user-interfaces/form/FormEntry";
import { ButtonColorPicker } from "../user-interfaces/form/form-elements/ButtonColorPicker";
import { NumberInput } from "../user-interfaces/form/form-elements/NumberInput";
import { ButtonGroup } from "../user-interfaces/form/form-elements/helpers/ButtonGroup";
import { Button } from "../user-interfaces/form/form-elements/Button";
import { Select } from "../user-interfaces/form/form-elements/Select";
import { Section } from "../user-interfaces/form/form-elements/helpers/Section";
import { SingleRow } from "../user-interfaces/form/form-elements/helpers/SingleRow";
import { Icon } from "../user-interfaces/form/form-elements/helpers/Icon";
import { ProjectionSpecification } from "../../core/projections/ProjectionSpecification";
import { SyntacticFragment } from "../../core/fragments/syntactic/SyntacticFragment";

const markPropertyTemplate = JsonObjectTemplate.createForAssignmentToKeyNamed(
    "mark",
    [
        createSlotSpecification("fill", FormEntryType.Color, (color: Color) => color.equals(Color.fromHexString("#4682b4"))),
        createSlotSpecification("stroke", FormEntryType.Color, (color: Color) => color.equals(Color.fromHexString("#4682b4"))),
        createSlotSpecification("strokeWidth", FormEntryType.Number, 0),
        createSlotSpecification("strokeDash", FormEntryType.String, ""),
        createSlotSpecification("font", FormEntryType.String, "sans-serif"),
        createSlotSpecification("fontSize", FormEntryType.Number, 11),
        createSlotSpecification("fontWeight", FormEntryType.String, "normal"),
        createSlotSpecification("fontStyle", FormEntryType.String, "normal"),
    ],
    { ...FORM_DATA_TEMPLATE_TRANSFORMERS }
);

function blockOfLength(size: number) {
    return <div style={{
        width: size,
        height: 5,
        backgroundColor: "rgba(0, 0, 0, 0.7)"
    }} />;
}

const form = <>
    {/* <Section title="Background/fill">
        <ButtonColorPicker formEntryKey="fill" defaultValue={Color.fromHexString("#4682b4")} label="Fill color" />
    </Section> */}

    <Section title="Fill and stroke">
        <SingleRow gapSize={25}>
            <ButtonColorPicker formEntryKey="fill" defaultValue={Color.fromHexString("#4682b4")} label="Fill color" />

            <ButtonColorPicker formEntryKey="stroke" defaultValue={Color.fromHexString("#4682b4")} label="Stroke color" />

            <SingleRow label="Thickness (px)">
                <NumberInput formEntryKey="strokeWidth" defaultValue={0} min={0} />

                {/* <ButtonGroup>
                    <Button
                        formEntryKey="strokeWidth"
                        text={<Icon id="disable" />}
                        valueWithType={[0, FormEntryType.Number]}
                        activateOn={[0, null]}
                        showWithoutValue={true}
                    />
                    <Button
                        formEntryKey="strokeWidth"
                        text={blockOfLength(1)}
                        valueWithType={[1, FormEntryType.Number]}
                        activateOn={1}
                        showWithoutValue={true}
                    />
                    <Button
                        formEntryKey="strokeWidth"
                        text={blockOfLength(3)}
                        valueWithType={[3, FormEntryType.Number]}
                        activateOn={3}
                        showWithoutValue={true}
                    />
                    <Button
                        formEntryKey="strokeWidth"
                        text={blockOfLength(5)}
                        valueWithType={[5, FormEntryType.Number]}
                        activateOn={5}
                        showWithoutValue={true}
                    />
                    <Button
                        formEntryKey="strokeWidth"
                        text={blockOfLength(10)}
                        valueWithType={[10, FormEntryType.Number]}
                        activateOn={10}
                        showWithoutValue={true}
                    />
                </ButtonGroup> */}
            </SingleRow>

            <ButtonGroup label="Line style">
                <Button
                    formEntryKey="strokeDash"
                    text="—"
                    valueWithType={["", FormEntryType.String]}
                    activateOn={["solid", null]} showWithoutValue={true}
                />
                <Button
                    formEntryKey="strokeDash"
                    text="--"
                    valueWithType={["[2, 2]", FormEntryType.String]}
                    activateOn="[2, 2]" showWithoutValue={true}
                />
                <Button
                    formEntryKey="strokeDash"
                    text="···"
                    valueWithType={["[1, 1]", FormEntryType.String]}
                    activateOn="[1, 1]" showWithoutValue={true}
                />
            </ButtonGroup>
        </SingleRow>
    </Section>

    <Section title="Text">
        <SingleRow gapSize={25}>
            <SingleRow label="Thickness (px)">
                <Button<FormEntryType.Number>
                    formEntryKey="fontSize"
                    text="–"
                    valueWithType={v => [v === null ? 10 : Math.max(1, v! - 1), FormEntryType.Number]}
                    showWithoutValue={true}
                />
                <NumberInput formEntryKey="fontSize" defaultValue={11} min={0} hideButtons={true} />
                <Button<FormEntryType.Number>
                    formEntryKey="fontSize"
                    text="+"
                    valueWithType={v => [v === null ? 12 : v! + 1, FormEntryType.Number]}
                    showWithoutValue={true}
                />
            </SingleRow>

            <Select formEntryKey="font" items={["sans-serif", "serif", "monospace"]} defaultItem="sans-serif" label="Font family" />

            <ButtonGroup>
                <Button
                    formEntryKey="fontWeight"
                    text={<Icon id="bold" />}
                    valueWithType={v => [v === "normal" || v === null ? "bold" : "normal", FormEntryType.String]}
                    activateOn="bold" showWithoutValue={true}
                />
                <Button
                    formEntryKey="fontStyle"
                    text={<Icon id="italic" />}
                    valueWithType={v => [v === "normal" || v === null ? "italic" : "normal", FormEntryType.String]}
                    activateOn="italic"
                    showWithoutValue={true}
                />
            </ButtonGroup>
        </SingleRow>
    </Section>
</>;

export const vegaMarksStyleInspectorSpecification: ProjectionSpecification<SyntacticFragment> = {
    name: "Vega marks' style inspector",
    requirements: { languages: ["json"] },

    ...markPropertyTemplate.resourcesAndMappings,

    userInterface: {
        name: "form",
        settings: { content: form }
    },
    renderer: {
        name: "button-popover",
        settings: { buttonContent:  "🎨 edit style" }
    }
};

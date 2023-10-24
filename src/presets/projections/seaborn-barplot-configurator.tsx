import { SideRendererPosition } from "../renderers/side/SideRendererSettings";
import { ButtonColorPicker } from "../user-interfaces/form/form-elements/ButtonColorPicker";
import { Section } from "../user-interfaces/form/form-elements/helpers/Section";
import { SingleRow } from "../user-interfaces/form/form-elements/helpers/SingleRow";
import { NumberInput } from "../user-interfaces/form/form-elements/NumberInput";
import { Select } from "../user-interfaces/form/form-elements/Select";
import { StringInput } from "../user-interfaces/form/form-elements/StringInput";
import { FormEntryType } from "../user-interfaces/form/FormEntry";
import { createSlotSpecification, FORM_DATA_TEMPLATE_TRANSFORMERS } from "../user-interfaces/form/template-form-utilities";
import { Color } from "../../utilities/Color";
import { PythonFunctionCallNamedArgumentsTemplate } from "../../utilities/languages/python/PythonFunctionCallNamedArgumentsTemplate";
import { ProjectionSpecification } from "../../core/projections/ProjectionSpecification";
import { SyntacticFragment } from "../../core/fragments/syntactic/SyntacticFragment";

const template = PythonFunctionCallNamedArgumentsTemplate.createForFunctionNamed(
    name => name.endsWith("barplot"),
    [
        createSlotSpecification("title", FormEntryType.String, ""),
        createSlotSpecification("xlabel", FormEntryType.String, ""),
        createSlotSpecification("ylabel", FormEntryType.String, ""),

        createSlotSpecification("color", FormEntryType.Color),
        createSlotSpecification("palette", FormEntryType.String, "deep"),

        createSlotSpecification("errorbar", FormEntryType.String),
        createSlotSpecification("errcolor", FormEntryType.Color),
        createSlotSpecification("errwidth", FormEntryType.Number, 0),
        createSlotSpecification("capsize", FormEntryType.Number, 0)
    ],
    { ...FORM_DATA_TEMPLATE_TRANSFORMERS }
);

const formContent = <>
    <Section title="Plot description">
        <StringInput
            formEntryKey="title"
            label="Title"
            defaultValue=""
        />
        <SingleRow>
            <StringInput
                formEntryKey="xlabel"
                label="X axis label"
                defaultValue=""
            />
            <StringInput
                formEntryKey="ylabel"
                label="Y axis label"
                defaultValue=""
            />
        </SingleRow>
    </Section>
    <Section title="Bar colour">
        <p>A single colour takes precedence over the palette.</p>
        <SingleRow gapSize={267}>
            <Select
                formEntryKey="palette"
                label="Colour palette"
                items={["deep", "muted", "pastel", "bright", "dark", "colorblind"]}
                defaultItem="deep"
            />
            <ButtonColorPicker
                formEntryKey="color"
                label="Single colour"
                defaultValue={Color.fromCss("#3C5CA0")}
            />
        </SingleRow>
    </Section>
    <Section title="Error bars">
        <SingleRow gapSize={25}>
            <Select
                formEntryKey="errorbar"
                label="Type of error bars"
                items={["None", "ci", "pi", "se", "sd"]}
                defaultItem="None"
            />
            <NumberInput
                formEntryKey="errwidth"
                label="Thickness"
                defaultValue={0}
            />
            <NumberInput
                formEntryKey="capsize"
                label="Length of caps"
                defaultValue={0}
            />
            <ButtonColorPicker
                formEntryKey="errcolor"
                label="Color"
                defaultValue={Color.fromCss("black")}
            />
        </SingleRow>
    </Section>
</>;

export const seabornBarplotConfiguratorSpecification: ProjectionSpecification<SyntacticFragment> = {
    ...template.resourcesAndMappings,

    name: "Seaborn's barplot configurator",
    
    requirements: { languages: ["python"] },
    
    userInterface: {
        name: "form",
        settings: { content: formContent }
    },
    
    renderer: {
        name: "side",
        settings: {
            onlyShowWhenCursorIsInRange: true,
            position: SideRendererPosition.RightSideOfCode,
            positionOffset: 100
        }
    }
};

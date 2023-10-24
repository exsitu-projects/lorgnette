import { SideRendererPosition } from "../renderers/side/SideRendererSettings";
import { RegexPatternTemplate } from "../../core/templates/textual/RegexPatternTemplate";
import { NumericEvaluator } from "../../core/templates/evaluators/numeric/NumericEvaluator";
import { ProjectionSpecification } from "../../core/projections/ProjectionSpecification";
import { TextualFragment } from "../../core/fragments/textual/TextualFragment";

const hexadecimalValuator = new NumericEvaluator({
    isIntegerValue: true,
    integerBase: 16
});

const hexadecimalColorTemplate = new RegexPatternTemplate(
    "#(?<r>[a-fA-F0-9]{2})(?<g>[a-fA-F0-9]{2})(?<b>[a-fA-F0-9]{2})",
    {
        "r": hexadecimalValuator,
        "g": hexadecimalValuator,
        "b": hexadecimalValuator
    },
    {
        transformTemplateData: data => { return { color: data }; },
        transformUserInterfaceOutput: output => { return { ...output.color }; }
    }
);

export const hexadecimalColorPickerSpecification: ProjectionSpecification<TextualFragment> = {
    ...hexadecimalColorTemplate.resourcesAndMappings,

    name: "Hexadecimal colour picker",

    requirements: {},

    userInterface: "color-picker",

    renderer: {
        name: "side",
        settings: {
            onlyShowWhenCursorIsInRange: true,
            position: SideRendererPosition.RightSideOfEditor
        }
    }
};

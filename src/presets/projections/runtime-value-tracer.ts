import { RegexPatternFinder } from "../../core/fragments/textual/RegexPatternFinder";
import { ProgrammableRuntimeRequestProvider } from "../../core/runtime/request-providers/ProgrammableRuntimeRequestProvider";
import { RuntimeRequest } from "../../core/runtime/RuntimeRequest";
import { SideRendererPosition } from "../renderers/side/SideRendererSettings";
import { ProjectionSpecification } from "../../core/projections/ProjectionSpecification";
import { ProgrammableForwardMapping } from "../../core/mappings/ProgrammableForwardMapping";
import { TextualFragment } from "../../core/fragments/textual/TextualFragment";

export const runtimeValueTracerSpecification: ProjectionSpecification<TextualFragment> = {
    name: "Runtime value tracer",

    requirements: { languages: ["typescript"] },

    pattern: new RegexPatternFinder("/\\*\\s*trace\\s*:\\s*\\w+\\s*\\*/"),

    runtimeRequest: new ProgrammableRuntimeRequestProvider(({ fragment }) => {
        const variableName = fragment.text
            .slice(
                fragment.text.indexOf(":") + 1,
                fragment.text.length - 2
            )
            .trim();
        
        return [
            RuntimeRequest.createForFragment(fragment, "variableValue", variableName)
        ];
    }),

    forwardMapping: new ProgrammableForwardMapping(({ runtimeResponses }) => {
        return {
            valueChanges: runtimeResponses.map(response => {
                const responseContentAsNumber = Number(response.content);
                return {
                    value: Number.isNaN(responseContentAsNumber)
                        ? response.content
                        : responseContentAsNumber,
                    timestamp: response.receptionTime
                };
            })
        };
    }),

    userInterface: "value-history",
    
    renderer: {
        name: "side",
        settings: {
            onlyShowWhenCursorIsInRange: false,
            position: SideRendererPosition.RightSideOfCode,
            positionOffset: 100
        }
    }
};
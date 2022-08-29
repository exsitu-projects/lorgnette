import { RegexPatternFinder } from "../core/fragments/textual/RegexPatternFinder";
import { ProgrammableInputMapping } from "../core/mappings/ProgrammableInputMapping";
import { AsideRenderer } from "../core/renderers/aside/AsideRenderer";
import { TextualMonocleProvider } from "../core/monocles/textual/TextualMonocleProvider";
import { ProgrammableRuntimeRequestProvider } from "../core/runtime/request-providers/ProgrammableRuntimeRequestProvider";
import { RuntimeRequest } from "../core/runtime/RuntimeRequest";
import { InputPrinter } from "../core/user-interfaces/input-printer/InputPrinter";
import { AsideRendererPosition } from "../core/renderers/aside/AsideRendererSettings";

export const runtimeValueTracerProvider = new TextualMonocleProvider({
    name: "Runtime value tracer",

    usageRequirements: { languages: ["typescript"] },

    fragmentProvider: new RegexPatternFinder("/\\*\\s*trace\\s*:\\s*\\w+\\s*\\*/"),

    runtimeRequestProvider: new ProgrammableRuntimeRequestProvider(({ fragment }) => {
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

    inputMapping: new ProgrammableInputMapping(({ runtimeResponses }) => {
        return {
            lastRuntimeResponses: runtimeResponses
        };
    }),

    userInterfaceProvider: InputPrinter.makeProvider(),
    
    rendererProvider: AsideRenderer.makeProvider({
        onlyShowWhenCursorIsInRange: false,
        position: AsideRendererPosition.RightSideOfCode,
        positionOffset: 200
    })
});
import { RegexPatternFinder } from "../core/fragments/textual/RegexPatternFinder";
import { ProgrammableInputMapping } from "../core/mappings/ProgrammableInputMapping";
import { TextualMonocleProvider } from "../core/monocles/textual/TextualMonocleProvider";
import { AsideRenderer } from "../core/renderers/aside/AsideRenderer";
import { AsideRendererPosition } from "../core/renderers/aside/AsideRendererSettings";
import { ProgrammableRuntimeRequestProvider } from "../core/runtime/request-providers/ProgrammableRuntimeRequestProvider";
import { RuntimeRequest } from "../core/runtime/RuntimeRequest";
import { InputPrinter } from "../core/user-interfaces/input-printer/InputPrinter";
import { Input, Table } from "../core/user-interfaces/table/Table";

export const pythonRuntimeDataframeTableProvider = new TextualMonocleProvider({
    name: "Python dataframes",

    usageRequirements: {},

    fragmentProvider: new RegexPatternFinder("#\\s*df\\s*:\\s*\\w+(?=\\s+)"),

    runtimeRequestProvider: new ProgrammableRuntimeRequestProvider(({ fragment }) => {
        const dataframeExpression = fragment.text
            .slice(fragment.text.indexOf(":") + 1)
            .trim();
        
        return [
            RuntimeRequest.createForFragment(fragment, "content", `${dataframeExpression}.to_json(orient="values")`),
            RuntimeRequest.createForFragment(fragment, "rowIndex", `${dataframeExpression}.index.to_series().to_json(orient="values")`),
            RuntimeRequest.createForFragment(fragment, "columnIndex", `${dataframeExpression}.columns.to_series().to_json(orient="values")`)
        ];
    }),

    inputMapping: new ProgrammableInputMapping(({ runtimeResponses }) => {
        // Search for each runtime request backwards (to get the last one that arrived, if any).
        const reversedRuntimeResponses = runtimeResponses.reverse();

        const lastContentResponse = reversedRuntimeResponses.find(response => response.name === "content");
        const lastRowIndexResponse = reversedRuntimeResponses.find(response => response.name === "rowIndex");
        const lastColumnIndexResponse = reversedRuntimeResponses.find(response => response.name === "columnIndex");

        const input: Input = {};

        if (lastContentResponse) {
            try {
                input.content = JSON.parse(lastContentResponse.content.slice(1, -1));
            }
            catch (error) {
                console.warn("The content of the table could not be parsed as JSON:", lastContentResponse, error);
            }
        }

        if (lastRowIndexResponse) {
            try {
                input.rowHeader = JSON.parse(lastRowIndexResponse.content.slice(1, -1));
            }
            catch (error) {
                console.warn("The names of the table's rows could not be parsed as JSON:", lastRowIndexResponse, error);
            }
        }

        if (lastColumnIndexResponse) {
            try {
                input.columnHeader = JSON.parse(lastColumnIndexResponse.content.slice(1, -1));
            }
            catch (error) {
                console.warn("The names of the table's columns could not be parsed as JSON:", lastColumnIndexResponse, error);
            }
        }

        return input;
    }),

    userInterfaceProvider: Table.makeProvider(),

    rendererProvider: AsideRenderer.makeProvider({
        onlyShowWhenCursorIsInRange: true,
        position: AsideRendererPosition.RightSideOfEditor,
        positionOffset: 20
    })
});
import { RegexPatternFinder } from "../../core/fragments/textual/RegexPatternFinder";
import { SideRendererPosition } from "../renderers/side/SideRendererSettings";
import { ProgrammableRuntimeRequestProvider } from "../../core/runtime/request-providers/ProgrammableRuntimeRequestProvider";
import { RuntimeRequest } from "../../core/runtime/RuntimeRequest";
import { Input } from "../user-interfaces/table/Table";
import { ProjectionSpecification } from "../../core/projections/ProjectionSpecification";
import { ProgrammableForwardMapping } from "../../core/mappings/ProgrammableForwardMapping";

export const runtimePandasDataframeTableSpecification: ProjectionSpecification = {
    name: "Runtime Pandas dataframe table",

    // Note: no language requirement here, as this projection requires more of Python
    // than the subset supported by the Python language known by Lorgnette as of 2023.
    requirements: {},

    pattern: new RegexPatternFinder("#\\s*df\\s*:\\s*\\w+(?=\\s+)"),

    runtimeRequest: new ProgrammableRuntimeRequestProvider(({ fragment }) => {
        const dataframeExpression = fragment.text
            .slice(fragment.text.indexOf(":") + 1)
            .trim();
        
        return [
            RuntimeRequest.createForFragment(fragment, "content", `${dataframeExpression}.to_json(orient="values")`),
            RuntimeRequest.createForFragment(fragment, "rowIndex", `${dataframeExpression}.index.to_series().to_json(orient="values")`),
            RuntimeRequest.createForFragment(fragment, "columnIndex", `${dataframeExpression}.columns.to_series().to_json(orient="values")`)
        ];
    }),

    forwardMapping: new ProgrammableForwardMapping(({ runtimeResponses }) => {
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

    userInterface: "table",

    renderer: {
        name: "side",
        settings: {
            onlyShowWhenCursorIsInRange: true,
            position: SideRendererPosition.RightSideOfEditor,
            positionOffset: 20
        }
    }
};
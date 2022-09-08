import { TreePatternFinder } from "../core/fragments/syntactic/TreePatternFinder";
import { MarkdownSyntaxTreeNode } from "../core/languages/markdown/MarkdownSyntaxTreeNode";
import { SyntaxTreePattern } from "../core/languages/SyntaxTreePattern";
import { ProgrammableInputMapping } from "../core/mappings/ProgrammableInputMapping";
import { SyntacticMonocleProvider } from "../core/monocles/syntactic/SyntacticMonocleProvider";
import { AsideRenderer } from "../core/renderers/aside/AsideRenderer";
import { AsideRendererPosition } from "../core/renderers/aside/AsideRendererSettings";
import { Table, TableData } from "../core/user-interfaces/table/Table";

export const markdownTableProvider = new SyntacticMonocleProvider({
    name: "Markdown table",

    usageRequirements: { languages: ["markdown"] },

    fragmentProvider: new TreePatternFinder(new SyntaxTreePattern(n =>
        n.type === "table"
    )),

    inputMapping: new ProgrammableInputMapping(({ fragment }) => {
        const tableNode = fragment.node as MarkdownSyntaxTreeNode;
        const data: TableData = [];

        for (let rowNode of tableNode.childNodes) {
            const row: TableData[number] = []
            data.push(row);

            for (let cellNode of rowNode.childNodes) {
                if (cellNode.childNodes.length === 0) {
                    continue;
                }

                const cellText = cellNode.childNodes
                    .map(node => node.text)
                    .join("");
                row.push(cellText);
            }
        }

        return { data: data };
    }),

    userInterfaceProvider: Table.makeProvider(),
    
    rendererProvider: AsideRenderer.makeProvider({
        onlyShowWhenCursorIsInRange: false,
        position: AsideRendererPosition.RightSideOfEditor,
        positionOffset: 20
    })
});
import { TreePatternFinder } from "../core/fragments/syntactic/TreePatternFinder";
import { MarkdownSyntaxTreeNode } from "../core/languages/markdown/MarkdownSyntaxTreeNode";
import { SyntaxTreePattern } from "../core/languages/SyntaxTreePattern";
import { ProgrammableInputMapping } from "../core/mappings/ProgrammableInputMapping";
import { ProgrammableOutputMapping } from "../core/mappings/ProgrammableOutputMapping";
import { SyntacticMonocleProvider } from "../core/monocles/syntactic/SyntacticMonocleProvider";
import { AsideRenderer } from "../core/renderers/aside/AsideRenderer";
import { AsideRendererPosition } from "../core/renderers/aside/AsideRendererSettings";
import { EMPTY_TABLE_HEADER, Output, Table, TableContent } from "../core/user-interfaces/table/Table";
import { convertMdastToMarkdownString, createMdastTable } from "../utilities/languages/markdown/markdown-utilities";

export const markdownTableProvider = new SyntacticMonocleProvider({
    name: "Markdown table",

    usageRequirements: { languages: ["markdown"] },

    fragmentProvider: new TreePatternFinder(new SyntaxTreePattern(n =>
        n.type === "table"
    )),

    inputMapping: new ProgrammableInputMapping(({ fragment }) => {
        const tableNode = fragment.node as MarkdownSyntaxTreeNode;
        const content: TableContent = [];

        for (let rowNode of tableNode.childNodes) {
            const row: TableContent[number] = []
            content.push(row);

            for (let cellNode of rowNode.childNodes) {
                if (cellNode.childNodes.length === 0) {
                    row.push(null);
                    continue;
                }

                const cellText = cellNode.childNodes
                    .map(node => node.text)
                    .join("");
                row.push(cellText);
            }
        }

        return {
            content: content,
            rowHeader: EMPTY_TABLE_HEADER,
            columnHeader: EMPTY_TABLE_HEADER
        };
    }),

    outputMapping: new ProgrammableOutputMapping(({ output, fragment, documentEditor }) => {
        const { selection, cellChanges, content }: Output = output;

        if (cellChanges) {
            const mdastTable = createMdastTable(content);
            documentEditor.replace(
                fragment.range,
                convertMdastToMarkdownString(mdastTable)
            );

            documentEditor.applyEdits();
        }

        // Update the selection, if any.
        if (selection.length > 0) {
            // TODO: modify the selection.
        }
    }),

    userInterfaceProvider: Table.makeProvider(),
    
    rendererProvider: AsideRenderer.makeProvider({
        onlyShowWhenCursorIsInRange: false,
        position: AsideRendererPosition.RightSideOfEditor,
        positionOffset: 20
    })
});
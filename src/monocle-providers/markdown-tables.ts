import { Range } from "../core/documents/Range";
import { TreePatternFinder } from "../core/fragments/syntactic/TreePatternFinder";
import { MarkdownSyntaxTreeNode } from "../core/languages/markdown/MarkdownSyntaxTreeNode";
import { SyntaxTreePattern } from "../core/languages/SyntaxTreePattern";
import { ProgrammableInputMapping } from "../core/mappings/ProgrammableInputMapping";
import { ProgrammableOutputMapping } from "../core/mappings/ProgrammableOutputMapping";
import { SyntacticMonocleProvider } from "../core/monocles/syntactic/SyntacticMonocleProvider";
import { AsideRenderer } from "../core/renderers/aside/AsideRenderer";
import { AsideRendererPosition } from "../core/renderers/aside/AsideRendererSettings";
import { EMPTY_TABLE_HEADER, Output, Table, TableContent } from "../core/user-interfaces/table/Table";

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

    outputMapping: new ProgrammableOutputMapping(({ output, fragment, document, documentEditor }) => {
        const { selection, cellChanges }: Output = output;
        const tableNode = fragment.node as MarkdownSyntaxTreeNode;
        
        // Update the table.
        if (cellChanges) {
            for (let cellChange of cellChanges) {
                const rowIndex = cellChange.coordinates.row;
                const columnIndex = cellChange.coordinates.column;

                const cellNode = tableNode.childNodes[rowIndex].childNodes[columnIndex];
                const cellNodeStart = cellNode.range.start;
                const cellNodeEnd = cellNode.range.end;

                const cellContentRange = cellNode.childNodes.length > 0
                    ? Range.enclose(cellNode.childNodes.map(node => node.range))
                    : columnIndex === 0
                        ? new Range(cellNodeStart.shiftBy(0, 1, 1), cellNodeEnd.shiftBy(0, -1, -1)) // Remove leading + trailing '|'s
                        : new Range(cellNodeStart, cellNodeEnd.shiftBy(0, -1, -1)) // Remove trailing '|'

                documentEditor.replace(
                    cellContentRange,
                    cellChange.newData === null
                        ? ""
                        : cellChange.newData.toString()
                );
            }

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
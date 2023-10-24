import { TreePatternFinder } from "../../core/fragments/syntactic/TreePatternFinder";
import { MarkdownSyntaxTreeNode } from "../languages/markdown/MarkdownSyntaxTreeNode";
import { SyntaxTreePattern } from "../../core/languages/SyntaxTreePattern";
import { ProgrammableBackwardMapping } from "../../core/mappings/ProgrammableBackwardMapping";
import { SideRendererPosition } from "../renderers/side/SideRendererSettings";
import { EMPTY_TABLE_HEADER, Output, TableContent } from "../user-interfaces/table/Table";
import { convertMdastToMarkdownString, createMdastTable } from "../../utilities/languages/markdown/markdown-utilities";
import { ProjectionSpecification } from "../../core/projections/ProjectionSpecification";
import { ProgrammableForwardMapping } from "../../core/mappings/ProgrammableForwardMapping";
import { SyntacticFragment } from "../../core/fragments/syntactic/SyntacticFragment";

const forwardMapping = new ProgrammableForwardMapping<SyntacticFragment>(({ fragment }) => {
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
});

const backwardMapping = new ProgrammableBackwardMapping<SyntacticFragment>(({ userInterfaceOutput, fragment, documentEditor }) => {
    const { selection, cellChanges, content }: Output = userInterfaceOutput;

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
});

export const interactiveMarkdownTableSpecification: ProjectionSpecification<SyntacticFragment> = {
    name: "Interactive Markdown table",

    requirements: { languages: ["markdown"] },

    pattern: new TreePatternFinder(new SyntaxTreePattern(n =>
        n.type === "table"
    )),
    
    forwardMapping: forwardMapping,

    backwardMapping: backwardMapping,

    userInterface: "table",
    
    renderer: {
        name: "side",
        settings: {
            onlyShowWhenCursorIsInRange: false,
            position: SideRendererPosition.RightSideOfEditor,
            positionOffset: 20
        }
    }
};
import { fromMarkdown } from "mdast-util-from-markdown";
import { toMarkdown } from "mdast-util-to-markdown";
import { gfmFromMarkdown, gfmToMarkdown } from "mdast-util-gfm";
import { gfm } from "micromark-extension-gfm";
import { TableContent } from "../../../presets/user-interfaces/table/Table";

function parse(text: string): MdastParentNode {
    return fromMarkdown(text, {
        extensions: [gfm()],
        mdastExtensions: [gfmFromMarkdown()]
    });
}

export type MdastValue = string;

export interface MdastNode {
    type: string;
}

export interface MdastParentNode extends MdastNode {
    children: MdastNode[];
}

export function createMdastParentNode(type: string, children: MdastNode[] = []): MdastParentNode {
    return {
        type: type,
        children: children
    };
}

export function createMdastTable(tableContent: TableContent): MdastParentNode {
    const tableNode = createMdastParentNode("table");
    
    for (let row of tableContent) {
        const rowNode = createMdastParentNode("tableRow");
        tableNode.children.push(rowNode);

        for (let cell of row) {
            const cellNode = createMdastParentNode("tableCell");
            rowNode.children.push(cellNode);

            const cellContentAsString = (cell ?? "").toString();
            const parsedCellContent = parse(cellContentAsString);
            cellNode.children.push(...parsedCellContent.children);
        }
    }

    return tableNode;
}

export function convertMdastToMarkdownString(node: MdastNode): string {
    return toMarkdown(node as any, {
        extensions: [gfmToMarkdown()]
    }).trim();
}

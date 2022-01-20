import { Document } from "../../../documents/Document";
import { DocumentEditor } from "../../../documents/DocumentEditor";
import { Position } from "../../../documents/Position";
import { Range } from "../../../documents/Range";
import { Output, TreeNodeWithRange } from "../Tree";
import { NodeMoveData } from "../TreeComponent";

interface HasRange {
    range: Range;
};

export class NodeMoveProcesser<T extends HasRange> {
    private readonly document: Document;
    private readonly editor: DocumentEditor;
    private readonly treeRoot: TreeNodeWithRange<T>;
    private readonly flattenedTree: TreeNodeWithRange<T>[];
    
    constructor(
        document: Document, 
        editor: DocumentEditor, 
        treeRoot: TreeNodeWithRange<T>, 
    ) {
        this.document = document;
        this.editor = editor;
        this.treeRoot = treeRoot;
        this.flattenedTree = this.flattenTree();
    }

    private flattenTree(): TreeNodeWithRange<T>[] {
        return this.flattenTreeRootedIn(this.treeRoot)
    }
    
    private flattenTreeRootedIn(node: TreeNodeWithRange<T>): TreeNodeWithRange<T>[] {
        if (!node.children) {
            return [node];
        }

        return [
            node,
            ...node.children
                .map(n => this.flattenTreeRootedIn(n))
                .flat()
        ];
    }

    private findTreeNodeWithFlatIndex(flatIndex: number): TreeNodeWithRange<T> | null {
        return flatIndex < this.flattenedTree.length
            ? this.flattenedTree[flatIndex]
            : null;
    }
        
    processNodeMove(moveData: NodeMoveData<T>): void {
        if (moveData.targetPosition.targetType === "between-items") {
            const movedNode = moveData.movedItem.data.data;
            const targetSiblingNode = this.findTreeNodeWithFlatIndex(moveData.targetPosition.linearIndex - 1);
            if (!targetSiblingNode) {
                return;
            }

            const insertPosition = moveData.targetPosition.linePosition === "top"
                ? targetSiblingNode.data.range.start
                : targetSiblingNode.data.range.end;
    
            // Some heuristics to make the changes look better (not very clever...).
            // TODO: improve whitespace management when reordering nodes in the tree.
            let movedNodeContent = this.document.getContentInRange(movedNode.range);
            const insertPositionLine = this.document.getContentInRange(new Range(
                new Position(insertPosition.row, 0, insertPosition.offset - insertPosition.column),
                insertPosition
            ));

            const insertPositionLineLeadingWhitespaceLength =
                insertPositionLine.length - insertPositionLine.trimLeft().length;
            let leadingWhitespace = " ".repeat(insertPositionLineLeadingWhitespaceLength);

            movedNodeContent = moveData.targetPosition.linePosition === "top"
                ? `${movedNodeContent.trim()}\n${leadingWhitespace}`
                : `\n${leadingWhitespace}${movedNodeContent.trim()}`;

            this.editor.delete(movedNode.range);
            this.editor.insert(insertPosition, movedNodeContent);
            this.editor.applyEdits();
        }
    }

    static processTreeOutput<T extends HasRange>(output: Output<T>, document: Document): void {
        const rootNode = output.data.rootNode;
        const nodeMoveData = output.data.lastNodeMoveData;

        if (!rootNode || !nodeMoveData) {
            console.log("No root node or move data: there is nothing to do in the output mapping of this tree.")
            return;
        }

        const nodeMoveProcesser = new NodeMoveProcesser(
            document,
            output.editor,
            rootNode
        );

        nodeMoveProcesser.processNodeMove(nodeMoveData);
    }
}
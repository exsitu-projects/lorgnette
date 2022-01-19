import { Document } from "../../../documents/Document";
import { DocumentEditor } from "../../../documents/DocumentEditor";
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
    // private readonly moveData: NodeMoveData<AstNode<any>>;
    
    constructor(
        document: Document, 
        editor: DocumentEditor, 
        treeRoot: TreeNodeWithRange<T>, 
        // moveData: NodeMoveData<AstNode<any>>
    ) {
        this.document = document;
        this.editor = editor;
        this.treeRoot = treeRoot;
        // this.moveData = moveData;
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
        console.log(">>>>>>>> TARGET TYPE = ", moveData.targetPosition.targetType);
        console.log(moveData)

        if (moveData.targetPosition.targetType === "between-items") {
            const movedNode = moveData.movedItem.data.data;
    
            const targetParentItemIndex = parseInt(moveData.targetPosition.parentItem.toString()) - 1;
            const childNodeAfterTargetIndex = moveData.targetPosition.childIndex;
    
            const targetParentNode = this.findTreeNodeWithFlatIndex(targetParentItemIndex);
            if (!targetParentNode) {
                return;
            }

            const insertPosition = childNodeAfterTargetIndex === 1
                ? targetParentNode.data.range.start
                : targetParentNode.children![childNodeAfterTargetIndex].data.range.start;
    
            let movedNodeContent = this.document.getContentInRange(movedNode.range);
            if (!movedNodeContent.endsWith("\n")) {
                movedNodeContent = `${movedNodeContent}\n`;
            }
    
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
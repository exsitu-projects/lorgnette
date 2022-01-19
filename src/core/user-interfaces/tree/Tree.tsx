import React from "react";
import { CodeVisualisation } from "../../visualisations/CodeVisualisation";
import { UserInterface, UserInterfaceOutput } from "../UserInterface";
import { NodeMoveData, TreeComponent, TreeNode } from "./TreeComponent";

export type Input<T> = TreeNode<T>;
export interface Output<T> extends UserInterfaceOutput {
    data: {
        rootNode: TreeNode<T> | null;
        lastNodeMoveData: NodeMoveData<T> | null;
    }
};

export class Tree<T = any> extends UserInterface<Input<T>, Output<T>> {
    private rootNode: TreeNode<T> | null;
    private lastNodeMoveData: NodeMoveData<T> | null;

    constructor(visualisation: CodeVisualisation) {
        super(visualisation);

        this.rootNode = null;
        this.lastNodeMoveData = null;
    }

    setTopLevelNodes(topLevelNodes: TreeNode<T>): void {
        this.rootNode = topLevelNodes;
    }

    createView(): JSX.Element {
        return <TreeComponent
            rootNode={this.rootNode}
            // onTreeDataChange={topLevelNodes => {
            //     console.log("change tree data", topLevelNodes);
            //     this.topLevelNodes = topLevelNodes;
            // }}
            onNodesMove={moveData => {
                console.log("tree node move data", moveData);

                // this.treeData = moveData.treeData;
                this.lastNodeMoveData = moveData;
                this.declareModelChange();
            }}
        />;
    }

    protected get modelOutput(): Output<T> {
        console.log("model output", {
            ...this.getPartialModelOutput(),
            data: {
                rootNode: this.rootNode,
                lastNodeMoveData: this.lastNodeMoveData
            }
        })

        return {
            ...this.getPartialModelOutput(),
            data: {
                rootNode: this.rootNode,
                lastNodeMoveData: this.lastNodeMoveData
            }
        };
    }

    updateModel(input: TreeNode<T>): void {
        // TODO: check input
        this.setTopLevelNodes(input);
    }
}
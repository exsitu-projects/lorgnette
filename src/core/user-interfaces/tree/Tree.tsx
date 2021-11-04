import React from "react";
import { CodeVisualisation } from "../../visualisations/CodeVisualisation";
import { UserInterface, UserInterfaceOutput } from "../UserInterface";
import { NodeMoveData, TreeComponent, TreeNode } from "./TreeComponent";

export type Input = TreeNode;
export interface Output extends UserInterfaceOutput {
    data: {
        rootNode: TreeNode | null;
        lastNodeMove: NodeMoveData | null;
    }
};

export class Tree extends UserInterface<Input, Output> {
    private rootNode: TreeNode | null;
    private lastNodeMoveData: NodeMoveData | null;

    constructor(visualisation: CodeVisualisation) {
        super(visualisation);

        this.rootNode = null;
        this.lastNodeMoveData = null;
    }

    setTopLevelNodes(topLevelNodes: TreeNode): void {
        this.rootNode = topLevelNodes;
    }

    createView(): JSX.Element {
        return <TreeComponent
            rootNode={this.rootNode}
            // onTreeDataChange={topLevelNodes => {
            //     console.log("change tree data", topLevelNodes);
            //     this.topLevelNodes = topLevelNodes;
            // }}
            onNodesMove={(movedNodes, targetPosition) => {
                console.log("tree node move", movedNodes, targetPosition);

                // this.treeData = moveData.treeData;
                // this.lastNodeMoveData = moveData;
                this.declareModelChange();
            }}
        />;
    }

    protected get modelOutput(): Output {
        return {
            ...this.getPartialModelOutput(),
            data: {
                rootNode: this.rootNode,
                lastNodeMove: this.lastNodeMoveData
            }
        };
    }

    updateModel(input: TreeNode): void {
        // TODO: check input
        this.setTopLevelNodes(input);
    }
}
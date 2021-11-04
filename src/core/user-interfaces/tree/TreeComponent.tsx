import React from "react";
// import SortableTree, { FullTree, NodeData, OnMovePreviousAndNextLocation, TreeItem } from "react-sortable-tree";
// import "react-sortable-tree/style.css";

import { UncontrolledTreeEnvironment, Tree, TreeItem, StaticTreeDataProvider, TreeItemIndex, DraggingPosition } from "react-complex-tree";
import "react-complex-tree/lib/style.css";

export interface TreeNode {
    title: string;
    children?: TreeNode[];
    canMove?: boolean;
};

export type TreeData = TreeItem[];
export type NodeMoveData = any;

type Props = {
    rootNode: TreeNode | null,
    // onTreeDataChange: (newTreeData: TreeData) => void,
    onNodesMove: (movedNodes: TreeItem[], targetPosition: DraggingPosition) => void,
};

export class TreeComponent extends React.PureComponent<Props> {
    private static nextUnusedTreeId: number = 1;

    private flattenTreeData(node: TreeNode): Record<TreeItemIndex, TreeItem> {
        let nextId = 1;
        const nodesToTreeItems = new Map<TreeNode, TreeItem>();

        const createTreemItems = (node: TreeNode): void => {
            const id = nextId;
            nextId += 1;
            const childNodes = node.children ?? [];

            for (let childNode of childNodes) {
                createTreemItems(childNode);
            }

            const children = childNodes.map(childNode => nodesToTreeItems.get(childNode)!.index);
            const treeItem: TreeItem = {
                index: id,
                data: { title: node.title },
                canMove: node.canMove,
                children: children,
                hasChildren: children.length > 0
            };

            nodesToTreeItems.set(node, treeItem);
        };

        createTreemItems(node);
        return Object.fromEntries(
            [...nodesToTreeItems.values()]
                .map(treeItem => [treeItem.index, treeItem])
        );
    }

    render() {
        if (!this.props.rootNode) {
            return <div className="ui tree" />;
        }

        const uniqueTreeId = TreeComponent.getUniqueTreeId();
        const treeId = `tree-${uniqueTreeId}`;

        const flattenedTreeData = this.flattenTreeData(this.props.rootNode);
        console.log("flat tree data", flattenedTreeData);

        console.info("items to expand", Object.values(flattenedTreeData)
        .filter(n => n.hasChildren)
        .map(n => n.index))

        return <div className="ui tree">
            {/* <SortableTree
                treeData={this.props.treeData}
                onChange={newTreeData => this.props.onTreeDataChange(newTreeData)}
                onMoveNode={moveData => this.props.onNodeMove(moveData)}
                canNodeHaveChildren={node => this.props.canNodeHaveChildren(node)}
            /> */}
            <UncontrolledTreeEnvironment
                dataProvider={new StaticTreeDataProvider(
                    flattenedTreeData
                )}
                getItemTitle={item => item.data.title}
                canReorderItems={true}
                canDragAndDrop={true}
                onDrop={(movedItems, targetPosition) => this.props.onNodesMove(movedItems, targetPosition)}
                viewState={{
                    [treeId]: {
                        // Expand all the items with children by default.
                        expandedItems: Object.values(flattenedTreeData)
                            .filter(n => n.hasChildren)
                            .map(n => n.index)
                    }
                }}
            >
                <Tree treeId={treeId} rootItem="1" />
            </UncontrolledTreeEnvironment>
        </div>;
    }

    private static getUniqueTreeId(): number {
        const id = TreeComponent.nextUnusedTreeId;
        TreeComponent.nextUnusedTreeId += 1;

        return id;
    }
}
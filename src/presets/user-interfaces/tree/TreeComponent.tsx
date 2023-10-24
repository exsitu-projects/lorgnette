import React from "react";
import "./tree-component.css";
import "react-complex-tree/lib/style.css";

import { Tree, TreeItem, TreeItemIndex, DraggingPosition, TreeItemRenderContext, TreeInformation, ControlledTreeEnvironment, TreeViewState } from "react-complex-tree";
import { TreeNode } from "./Tree";
import { LorgnetteContext } from "../../../core/lorgnette/LorgnetteContext";
import { LorgnetteEnvironmentState } from "../../../core/lorgnette/LorgnetteEnvironment";

export type TreeData = TreeItem[];
export type TreeItemData<T> = {
    title: string,
    preTitle?: string;
    postTitle?: string;
    data: T
};

export type NodeMoveData<T> = {
    movedItem: TreeItem<TreeItemData<T>>,
    targetPosition: DraggingPosition
};

type Props<T> = {
    rootNode: TreeNode<T> | null,
    onNodesMove: (moveData: NodeMoveData<T>) => void,
};

type State = {
    treeId: string,
    treeViewState: TreeViewState
}

export class TreeComponent<T> extends React.Component<Props<T>, State> {
    private static nextUnusedTreeId: number = 1;

    constructor(props: Props<T>) {
        super(props);
        this.state = {
            treeId: TreeComponent.getUniqueTreeId(),
            treeViewState: {}
        };
    }

    private createTreeItems(root: TreeNode<T>): Record<TreeItemIndex, TreeItem<TreeItemData<T>>> {
        const nodesToTreeItems = new Map<TreeItemIndex, TreeItem<TreeItemData<T>>>();
        
        const virtualRootItemId = 0;
        let nextItemId = 1;

        const mapSubtreeRootedIn = (node: TreeNode<T>) => {
            const itemId = nextItemId;
            nextItemId += 1;

            const childNodes = node.children ?? [];
            const childNodeIndices: TreeItemIndex[] = [];

            for (let childNode of childNodes) {
                const childNodeId = mapSubtreeRootedIn(childNode);
                childNodeIndices.push(childNodeId);
            }
    
            nodesToTreeItems.set(
                itemId,
                {
                    index: itemId,
                    data: {
                        title: node.title,
                        preTitle: node.preTitle,
                        postTitle: node.postTitle,
                        data: node.data
                    },
                    canMove: node.canMove,
                    children: childNodeIndices,
                    hasChildren: childNodeIndices.length > 0
                }
            );

            return itemId;
        };

        // Transform each tree node rooted in the given node to a tree item.
        mapSubtreeRootedIn(root);

        // Add a "virtual" root item in order to display the root node in the tree
        // (react-complex-tree seems to not display the root node, but only its children).
        if (nodesToTreeItems.size > 0) {
            nodesToTreeItems.set(
                virtualRootItemId,
                {
                    index: virtualRootItemId,
                    data: null as any,
                    canMove: false,
                    canRename: false,
                    children: [1], // The given root node
                    hasChildren: true
                }
            );
        }

        return Object.fromEntries(
            [...nodesToTreeItems.values()]
                .map(treeItem => [treeItem.index, treeItem])
        );
    };

    render() {
        if (!this.props.rootNode) {
            return <></>;
        }

        const treeId = this.state.treeId;
        const treeItems = this.createTreeItems(this.props.rootNode);
        const treeViewState = {
            [treeId]: {
                // Expand all the items with children by default.
                expandedItems: Object.values(treeItems)
                    .filter(n => n.hasChildren)
                    .map(n => n.index)
            }
        };

        return <LorgnetteContext.Consumer>{ environment => (
            <ControlledTreeEnvironment
                items={treeItems}
                getItemTitle={item => item.data.title}
                canReorderItems={true}
                canDragAndDrop={true}
                onDrop={(movedItems, targetPosition) => this.props.onNodesMove({
                    // TODO: deal with multiple moves?
                    movedItem: movedItems[0],
                    targetPosition: targetPosition
                })}
                viewState={treeViewState}
            >
                <Tree
                    treeId={treeId}
                    rootItem="0"
                    renderItemTitle={props => TreeComponent.renderTreeItemTitle<T>(props, environment)}
                />
            </ControlledTreeEnvironment>
        )}</LorgnetteContext.Consumer>;
    }

    private static getUniqueTreeId(): string {
        const id = TreeComponent.nextUnusedTreeId;
        TreeComponent.nextUnusedTreeId += 1;

        return `tree-${id}`;
    }

    private static renderTreeItemTitle<T>(
        props: {
            title: string;
            item: TreeItem<TreeNode<T>>,
            context: TreeItemRenderContext,
            info: TreeInformation,
        },
        environment: LorgnetteEnvironmentState
    ) {
        // TODO; do this another way
        const hasItemRange = props.item.data.data && (props.item.data.data as any)["range"];
        const itemRange = (props.item.data.data as any)["range"];

        return <div
            className="tree-item"
            draggable={props.context.canDrag}
            onMouseEnter={event => hasItemRange ? environment.setCodeEditorHoveredRanges([itemRange]) : {}}
            onMouseLeave={event => hasItemRange ? environment.setCodeEditorHoveredRanges([]) : {}}
            onClick={event => hasItemRange ? environment.setCodeEditorSelectedRanges([itemRange]) : {}}
            data-rct-item-interactive={true}
            data-rct-item-id={props.item.index}
            onLoad={event => props.context.expandItem()}
        >
            <div className="title">
                <span className="pre-title">{props.item.data.preTitle}</span>
                {props.title}
                <span className="post-title">{props.item.data.postTitle}</span>
            </div>
            <div className="range">
                {hasItemRange ? itemRange.toString() : ""}
            </div>
        </div>
    };
}
import React, { useRef } from "react";
import "./tree-component.css";
import "react-complex-tree/lib/style.css";

import { Tree, TreeItem, TreeItemIndex, DraggingPosition, TreeItemRenderContext, TreeInformation, TreeEnvironmentRef, ControlledTreeEnvironment, TreeViewState } from "react-complex-tree";
import { GlobalContext, GlobalContextContent } from "../../../context";
import { Range } from "../../documents/Range";

export interface TreeNode<T = any> {
    title: string;
    preTitle?: string;
    postTitle?: string;
    data: T;
    range?: Range;
    children?: TreeNode<T>[];
    canMove?: boolean;
};

export type TreeData = TreeItem[];
export type TreeItemData<T> = {
    title: string,
    preTitle?: string;
    postTitle?: string;
    range?: Range,
    data: T
};

export type NodeMoveData<T> = {
    movedItem: TreeItem<TreeItemData<T>>,
    targetPosition: DraggingPosition
};

type Props<T> = {
    rootNode: TreeNode<T> | null,
    // onTreeDataChange: (newTreeData: TreeData) => void,
    onNodesMove: (moveData: NodeMoveData<T>) => void,
};

type State<T> = {
    treeId: string,
    treeEnvironementRef: React.Ref<TreeEnvironmentRef<T>>,
    treeViewState: TreeViewState
}

export class TreeComponent<T> extends React.Component<Props<T>, State<T>> {
    private static nextUnusedTreeId: number = 1;

    constructor(props: Props<T>) {
        super(props);

        this.state ={
            treeId: TreeComponent.getUniqueTreeId(),
            treeEnvironementRef: React.createRef(),
            treeViewState: {}
        };
    }

    private flattenTreeData(node: TreeNode<T>): Record<TreeItemIndex, TreeItem<TreeItemData<T>>> {
        const virtualRootId = 0;
        let nextId = 1;
        const nodesToTreeItems = new Map<TreeNode<T>, TreeItem<TreeItemData<T>>>();

        const createTreeItems = (node: TreeNode<T>): void => {
            const id = nextId;
            nextId += 1;
            const childNodes = node.children ?? [];

            for (let childNode of childNodes) {
                createTreeItems(childNode);
            }

            const children = childNodes.map(childNode => nodesToTreeItems.get(childNode)!.index);
            const treeItem: TreeItem<TreeItemData<T>> = {
                index: id,
                data: {
                    title: node.title,
                    preTitle: node.preTitle,
                    postTitle: node.postTitle,
                    range: node.range,
                    data: node.data
                },
                canMove: node.canMove,
                children: children,
                hasChildren: children.length > 0
            };

            nodesToTreeItems.set(node, treeItem);
        };

        createTreeItems(node);
        
        if (nodesToTreeItems.size > 0) {
            nodesToTreeItems.set(
                {
                    title: "(virtual root)",
                    data: null as any
                },
                {
                    index: virtualRootId,
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
    }

    // componentDidUpdate() {
    //     // For an unknown reason, the type of the React ref does not seem
    //     // to include a 'current' property. We cast it to make it appear.
    //     const ref = this.state.treeEnvironementRef as { current: TreeEnvironmentRef };
    //     if (ref.current) {
    //         const itemIds = Object.keys(ref.current.items);
    //         for (let itemId of itemIds) {
    //             ref.current.expandItem(itemId, this.state.treeId);
    //         }
    //     }
    // }

    render() {
        const renderTreeItemTitle = (
            props: {
                title: string;
                item: TreeItem<TreeNode<T>>,
                context: TreeItemRenderContext,
                info: TreeInformation,
            },
            context: GlobalContextContent
        ) => {
            const itemRange = props.item.data.range;
            const hasItemRange = !!itemRange;

            return <div
                className="tree-item"
                draggable={props.context.canDrag}
                onMouseEnter={ event => hasItemRange ? context.updateCodeEditorRanges({ hovered: [itemRange!] }) : {} }
                onMouseLeave={ event => hasItemRange ? context.updateCodeEditorRanges({ hovered: [] }) : {} }
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

        if (!this.props.rootNode) {
            return <div className="ui tree" />;
        }

        const treeId = this.state.treeId;
        // const treeEnvironementRef = this.state.treeEnvironementRef;

        const flattenedTreeData = this.flattenTreeData(this.props.rootNode);
        const treeViewState = {
            [treeId]: {
                // Expand all the items with children by default.
                expandedItems: Object.values(flattenedTreeData)
                    .filter(n => n.hasChildren)
                    .map(n => n.index)
            }
        };

        return <div className="ui tree">
            <GlobalContext.Consumer>{ context => (
                <ControlledTreeEnvironment
                    items={flattenedTreeData}
                    getItemTitle={item => item.data.title}
                    canReorderItems={true}
                    canDragAndDrop={true}
                    onDrop={(movedItems, targetPosition) => this.props.onNodesMove({
                        // TODO: deal with multiple moves?
                        movedItem: movedItems[0],
                        targetPosition: targetPosition
                    })}
                    viewState={treeViewState}
                    // ref={treeEnvironementRef}
                >
                        <Tree
                            treeId={treeId}
                            rootItem="0"
                            renderItemTitle={props => renderTreeItemTitle(props, context)}

                        />
                </ControlledTreeEnvironment>
            )}</GlobalContext.Consumer>
        </div>;
    }

    private static getUniqueTreeId(): string {
        const id = TreeComponent.nextUnusedTreeId;
        TreeComponent.nextUnusedTreeId += 1;

        return `tree-${id}`;
    }
}
import React from "react";
import "./syntax-tree.css";
import { SyntaxTreeNode as Node } from "../../../core/languages/SyntaxTreeNode";
import { CodeRange } from "../../../utilities/components/CodeRange";
import { Position } from "../../../core/documents/Position";

export interface SyntaxTreeNodeEventHandlerProps {
    onMouseTargetNodeChange?: (newTargetNode: Node | null) => void;
    onMouseClickNode?: (node: Node) => void;
}

export interface Props extends SyntaxTreeNodeEventHandlerProps {
    node: Node;
    parentNode: Node | null;
    cursorPosition: Position;
};

export class SyntaxTreeNode extends React.PureComponent<Props> {
    private get eventHandlerProps() {
        const props = this.props;
        return {
            onMouseEnter: () => {
                if (this.props.onMouseTargetNodeChange) {
                    this.props.onMouseTargetNodeChange(this.props.node);
                }
            },
            onMouseLeave: () => {
                if (this.props.onMouseTargetNodeChange) {
                    this.props.onMouseTargetNodeChange(this.props.parentNode);
                }
            },
            onClick: () => props.onMouseClickNode && props.onMouseClickNode(props.node)
        };
    }

    private get containsCursor(): boolean {
        return this.props.node.range.contains(this.props.cursorPosition);
    }

    render() {
        const classNames = this.containsCursor
            ? "syntax-tree-node contains-cursor"
            : "syntax-tree-node";

        return (
            <div
                className={classNames}
                {...this.eventHandlerProps}
            >
                <div className="syntax-tree-node-data">
                    <span className="type">{this.props.node.type}</span>
                    <span className="range">
                        <CodeRange range={this.props.node.range} />
                    </span>
                </div>
                <div className="syntax-tree-node-children">
                {
                    this.props.node.childNodes.map(node =>
                        <SyntaxTreeNode
                            {...this.props}
                            node={node}
                            parentNode={this.props.node}
                        />
                    )
                }
                </div>
            </div>
        );
    }
}
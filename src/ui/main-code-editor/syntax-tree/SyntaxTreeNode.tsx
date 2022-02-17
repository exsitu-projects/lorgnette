import React from "react";
import "./syntax-tree.css";
import { SyntaxTreeNode as Node } from "../../../core/languages/SyntaxTreeNode";
import { CodeRange } from "../../utilities/CodeRange";

export interface SyntaxTreeNodeEventHandlerProps {
    onMouseEnterNode?: (syntaxTree: Node) => void;
    onMouseLeaveNode?: (syntaxTree: Node) => void;
    onMouseClickNode?: (syntaxTree: Node) => void;
}

export interface Props extends SyntaxTreeNodeEventHandlerProps {
    node: Node;
};

export class SyntaxTreeNode extends React.PureComponent<Props> {
    private get eventHandlerProps() {
        return {
            onMouseEnter: () => this.props.onMouseEnterNode && this.props.onMouseEnterNode(this.props.node),
            onMouseLeave: () => this.props.onMouseLeaveNode && this.props.onMouseLeaveNode(this.props.node),
            onClick: () => this.props.onMouseClickNode && this.props.onMouseClickNode(this.props.node)
        };
    }

    render() {
        return (
            <div
                className="syntax-tree-node"
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
                        <SyntaxTreeNode {...this.props} node={node} />
                    )
                }
                </div>
            </div>
        );
    }
}
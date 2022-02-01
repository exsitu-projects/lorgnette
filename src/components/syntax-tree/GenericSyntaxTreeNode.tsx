import React, { SyntheticEvent } from "react";
import "./syntax-tree.css";
import { SyntaxTreeNode } from "../../core/languages/SyntaxTreeNode";
import { CodeRange } from "../utilities/CodeRange";

export type GenericSyntaxTreeNodeEventHandlers = {
    onMouseEnterNode: (syntaxTree: SyntaxTreeNode, event: SyntheticEvent) => void,
    onMouseLeaveNode: (syntaxTree: SyntaxTreeNode, event: SyntheticEvent) => void,
    onMouseClickNode: (syntaxTree: SyntaxTreeNode, event: SyntheticEvent) => void
};

type Props = {
    node: SyntaxTreeNode;
    eventHandlers: Partial<GenericSyntaxTreeNodeEventHandlers>
};

export class GenericSyntaxTreeNode extends React.PureComponent<Props> {
    render() {
        const makeEventHandlerProp = (eventHandler?: (syntaxTree: SyntaxTreeNode, event: SyntheticEvent) => void) => {
            return eventHandler
                ? (event: SyntheticEvent) => eventHandler(this.props.node, event)
                : () => {};
        };

        const eventHandlerProps = {
            onMouseEnter: makeEventHandlerProp(this.props.eventHandlers.onMouseEnterNode),
            onMouseLeave: makeEventHandlerProp(this.props.eventHandlers.onMouseLeaveNode),
            onClick: makeEventHandlerProp(this.props.eventHandlers.onMouseClickNode),
        };

        return (
            <div
                className="syntax-tree-node"
                {...eventHandlerProps}
            >
                <div className="syntax-tree-node-data">
                    <span className="type">{this.props.node.type}</span>
                    <span className="range">
                        <CodeRange range={this.props.node.range} />
                    </span>
                </div>
                <div className="syntax-tree-node-children">
                {
                    this.props.node.childNodes.map(node => <GenericSyntaxTreeNode node={node} eventHandlers={this.props.eventHandlers}/>)
                }
                </div>
            </div>
        );
    }
}
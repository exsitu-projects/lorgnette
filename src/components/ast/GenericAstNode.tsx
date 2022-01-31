import React, { SyntheticEvent } from "react";
import "./ast.css";
import { AstNode } from "../../core/languages/AstNode";
import { CodeRange } from "../utilities/CodeRange";

export type GenericAstNodeEventHandlers = {
    onMouseEnterNode: (astNode: AstNode, event: SyntheticEvent) => void,
    onMouseLeaveNode: (astNode: AstNode, event: SyntheticEvent) => void,
    onMouseClickNode: (astNode: AstNode, event: SyntheticEvent) => void
};

type Props = {
    node: AstNode;
    eventHandlers: Partial<GenericAstNodeEventHandlers>
};

export class GenericAstNode extends React.PureComponent<Props> {
    render() {
        const makeEventHandlerProp = (eventHandler?: (astNode: AstNode, event: SyntheticEvent) => void) => {
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
                className="ast-node"
                {...eventHandlerProps}
            >
                <div className="ast-node-data">
                    <span className="type">{this.props.node.type}</span>
                    <span className="range">
                        <CodeRange range={this.props.node.range} />
                    </span>
                </div>
                <div className="ast-node-children">
                {
                    this.props.node.childNodes.map(node => <GenericAstNode node={node} eventHandlers={this.props.eventHandlers}/>)
                }
                </div>
            </div>
        );
    }
}
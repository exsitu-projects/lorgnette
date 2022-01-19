import React from "react";
import "./ast.css";
import { Ast } from "../../core/languages/Ast";
import { GenericAstNode, GenericAstNodeEventHandlers } from "./GenericAstNode";

type Props = {
    ast: Ast,
    eventHandlers: Partial<GenericAstNodeEventHandlers>
};

export class GenericAst extends React.PureComponent<Props> {
    render() {
        return (
            <div className="ast">
                <GenericAstNode
                    node={this.props.ast.root}
                    eventHandlers={this.props.eventHandlers}
                />
            </div>
        );
    }
}

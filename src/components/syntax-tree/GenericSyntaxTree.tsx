import React from "react";
import "./syntax-tree.css";
import { SyntaxTree } from "../../core/languages/SyntaxTree";
import { GenericSyntaxTreeNode, GenericSyntaxTreeNodeEventHandlers } from "./GenericSyntaxTreeNode";

type Props = {
    syntaxTree: SyntaxTree,
    eventHandlers: Partial<GenericSyntaxTreeNodeEventHandlers>
};

export class GenericSyntaxTree extends React.PureComponent<Props> {
    render() {
        return (
            <div className="syntax-tree">
                <GenericSyntaxTreeNode
                    node={this.props.syntaxTree.root}
                    eventHandlers={this.props.eventHandlers}
                />
            </div>
        );
    }
}

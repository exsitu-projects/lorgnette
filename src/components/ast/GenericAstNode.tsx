import React from "react";
import "./ast.css";
import { AstNode } from "../../core/languages/AstNode";
import { CodeRange } from "../utilities/CodeRange";

type Props = {
    node: AstNode;
};

export class GenericAstNode extends React.PureComponent<Props> {
    render() {
        return (
            <div className="ast-node">
                <div className="ast-node-data">
                    <span className="type">{this.props.node.type}</span>
                    <span className="range">
                        <CodeRange range={this.props.node.range} />
                    </span>
                </div>
                <div className="ast-node-children">
                {
                    this.props.node.childNodes.map(node => <GenericAstNode node={node} />)
                }
                </div>
            </div>
        );
    }
}
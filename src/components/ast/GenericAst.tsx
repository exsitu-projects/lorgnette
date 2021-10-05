import React from "react";
import "./ast.css";
import { Ast } from "../../core/languages/Ast";
import { GenericAstNode } from "./GenericAstNode";

type Props = {
    ast: Ast;
};

export class GenericAst extends React.PureComponent<Props> {
    render() {
        return (
            <div className="ast">
                <GenericAstNode node={this.props.ast.root} />
            </div>
        );
    }
}

import React from "react";
import "./syntax-tree.css";
import { Document } from "../../../core/documents/Document";
import { SyntaxTreeNode, SyntaxTreeNodeEventHandlerProps } from "./SyntaxTreeNode";

interface Props extends SyntaxTreeNodeEventHandlerProps {
    document: Document,
};

export class SyntaxTree extends React.PureComponent<Props> {
    render() {
        const language = this.props.document.language;
        if (!language.parser) {
        return <div className="syntax-tree-message no-parser">
            There is no parser for the <em>{language.name}</em> language.
        </div>
        }

        try {
            return <div className="syntax-tree">
                <SyntaxTreeNode
                    {...this.props}
                    node={this.props.document.syntaxTree.root}
                />
            </div>;
        }
        catch (error: any) {
            return (
                <div className="syntax-tree-message parsing-error">
                    <strong>Parsing error:</strong>
                    <div className="parsing-error-message">{error.toString()}</div>
                </div>
            );
        }
    }
}
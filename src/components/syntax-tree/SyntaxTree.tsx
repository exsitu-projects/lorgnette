import React from "react";
import "./syntax-tree.css";
import { Document } from "../../core/documents/Document";
import { Language } from "../../core/languages/Language";
import { GenericSyntaxTree } from "./GenericSyntaxTree";
import { GenericSyntaxTreeNodeEventHandlers } from "./GenericSyntaxTreeNode";

type Props = {
    document: Document,
    eventHandlers: Partial<GenericSyntaxTreeNodeEventHandlers>
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
            return <GenericSyntaxTree
                syntaxTree={this.props.document.syntaxTree}
                eventHandlers={this.props.eventHandlers}
            />;
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
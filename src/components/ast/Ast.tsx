import React from "react";
import "./ast.css";
import { Document } from "../../core/documents/Document";
import { Language } from "../../core/languages/Language";
import { GenericAst } from "./GenericAst";
import { GenericAstNodeEventHandlers } from "./GenericAstNode";

type Props = {
    document: Document,
    eventHandlers: Partial<GenericAstNodeEventHandlers>
};

export class Ast extends React.PureComponent<Props> {
    render() {
        const language = this.props.document.language;
        if (!language.parser) {
        return <div className="ast-message no-parser">
            There is no parser for the <em>{language.name}</em> language.
        </div>
        }

        try {
            return <GenericAst
                ast={this.props.document.ast}
                eventHandlers={this.props.eventHandlers}
            />;
        }
        catch (error: any) {
            return (
                <div className="ast-message parsing-error">
                    <strong>Parsing error:</strong>
                    <div className="parsing-error-message">{error.toString()}</div>
                </div>
            );
        }
    }
}
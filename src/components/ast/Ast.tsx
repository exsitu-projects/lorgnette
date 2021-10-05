import React from "react";
import "./ast.css";
import { Document } from "../../core/documents/Document";
import { Language } from "../../core/languages/Language";
import { GenericAst } from "./GenericAst";

type Props = {
    document: Document,
    language: Language
};

export class Ast extends React.PureComponent<Props> {
    render() {
        const parser = this.props.language.parser;
        if (!parser) {
        return <div className="ast-message no-parser">
            There is no parser for the <em>{this.props.language.name}</em> language.
        </div>
        }

        try {
            const documentContent = this.props.document.content;
            const ast = parser.parse(documentContent);
            return <GenericAst ast={ast} />;
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
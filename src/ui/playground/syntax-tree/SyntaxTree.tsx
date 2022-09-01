import React from "react";
import "./syntax-tree.css";
import { Document } from "../../../core/documents/Document";
import { SyntaxTreeNode, SyntaxTreeNodeEventHandlerProps } from "./SyntaxTreeNode";
import { Position } from "../../../core/documents/Position";
import { SyntaxTree as DocumentSyntaxTree } from "../../../core/languages/SyntaxTree";

interface Props extends SyntaxTreeNodeEventHandlerProps {
    document: Document;
    cursorPosition: Position;
};


interface State {
    syntaxTree: DocumentSyntaxTree | null;
    lastParsingError: string | null;
}

export class SyntaxTree extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            syntaxTree: null,
            lastParsingError: null
        };

        this.updateSyntaxTree();
    }

    private get documentCanBeParsed(): boolean {
        return this.props.document.canBeParsed;
    }

    private updateSyntaxTree(): void {
        if (!this.documentCanBeParsed) {
            return;
        }

        this.props.document.syntaxTree
            .then(syntaxTree => {
                this.setState({
                    syntaxTree: syntaxTree,
                    lastParsingError: null
                });
            })
            .catch(error => {
                this.setState({
                    syntaxTree: null,
                    lastParsingError: error.toString()
                });
            });
    }

    componentDidUpdate(oldProps: Props): void {
        if (this.props.document !== oldProps.document) {
            this.updateSyntaxTree();
        }
    }

    render() {
        if (!this.documentCanBeParsed) {
            return <div className="syntax-tree-message no-parser">
                There is no parser for the <em>{this.props.document.language.name}</em> language.
            </div>;
        }

        const syntaxTree = this.state.syntaxTree;
        if (!syntaxTree) {
            const parsingError = this.state.lastParsingError;
            if (parsingError) {
                return <div className="syntax-tree-message parsing-error">
                    <strong>Parsing error:</strong>
                    <div className="parsing-error-message">{parsingError}</div>
                </div>;
            }
            else {
                return <div className="syntax-tree-message no-tree">
                    The syntax tree is not available at the moment.
                </div>;
            }
        }

        return <div className="syntax-tree">
            <SyntaxTreeNode
                {...this.props}
                node={syntaxTree.root}
                parentNode={null}
                cursorPosition={this.props.cursorPosition}
            />
        </div>;
    }
}
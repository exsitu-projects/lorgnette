import React, { ReactElement } from "react";
import Split from "react-split";
import { Alignment, Button, Divider, Menu, MenuItem, Popover, Switch } from "@blueprintjs/core";
import { Language } from "../../core/languages/Language";
import { SyntaxTree } from "./syntax-tree/SyntaxTree";
import { MonacoEditorWithProjections } from "../../utilities/monaco-editor/MonacoEditorWithProjections";
import { DEFAULT_EXAMPLE, Example, EXAMPLES } from "./examples/Example";
import { Projection } from "../../core/projections/Projection";
import { Document } from "../../core/documents/Document";
import { LorgnetteContext } from "../../core/lorgnette/LorgnetteContext";
import { LorgnetteEnvironmentState } from "../../core/lorgnette/LorgnetteEnvironment";

type Props = {};
type State = {
    showSyntaxTree: boolean;
    currentExample: Example;
};

export class Playground extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            showSyntaxTree: false,
            currentExample: DEFAULT_EXAMPLE
        }
    }

    private renderPlaygroundTitle(): ReactElement {
        return <>
            <a
                href="https://github.com/exsitu-projects/lorgnette"
                target="_blank"
                className="project-information-link"
            >
                <h1 className="title">The Lorgnette playground</h1>
                <span className="subtitle">a code editor with malleable projections</span>
            </a>
        </>;
    }

    private renderExampleSelector(environment: LorgnetteEnvironmentState): ReactElement {
        const renderExampleMenuItem = (example: Example): ReactElement => {
            return <MenuItem
                key={example.name}
                text={example.name}
                onClick={() => {
                    this.setState({ currentExample: example });
                    environment.setDocument(new Document(example.language, example.content))
                }}
            />;
        };
        
        const menu = <Menu>
            {EXAMPLES.map(example => renderExampleMenuItem(example))}
        </Menu>;
            
        return <Popover
            content={menu}
            position="bottom"
            modifiers={{ preventOverflow: { options: { padding: 10 }} }}
            transitionDuration={100}
        >
            <Button
                text="Load example..."
                rightIcon="caret-down"
                intent="primary"
            />
        </Popover>
    }

    private renderProjectionInfoText(projection: Projection): ReactElement {
        const range = projection.range.toPrettyString();
        return <li key={projection.uid}>
            {/* [#{projection.uid}] {projection.provider.name} ({range}) */}
            {/* [#{projection.uid}] {projection.provider.name} */}
            {projection.provider.name}
        </li>;
    }

    private renderActiveProjectionInfoText(environment: LorgnetteEnvironmentState): ReactElement | null {
        // TODO: update how an active projection is detected!
        const activeProjections: Projection[] = [];
        for (let projection of environment.projections) {
            if (projection.range.contains(environment.codeEditorCursorPosition)) {
                activeProjections.push(projection);
            }
        }

        const content = activeProjections.length === 0
            ? null
            : <>
                <strong>Projections at current position: </strong>
                <ul>
                    {activeProjections.map(projection => this.renderProjectionInfoText(projection))}
                </ul>
            </>;

        return <div className="active-projections-information">
            { content }
        </div>;
    }

    private renderLanguageSelector(environment: LorgnetteEnvironmentState): ReactElement {
        const renderLanguageMenuItem = (language: Language): ReactElement => {
            return <MenuItem
                key={language.name}
                text={language.name}
                label={language.id}
                onClick={() => {
                    environment.setDocument(
                        new Document(language, environment.document.content)
                    );
                }}
            />;
        };

        const menu = <Menu>
            {environment.languages.map(language => renderLanguageMenuItem(language))}
        </Menu>;

        return <Popover
            content={menu}
            position="top"
            modifiers={{ preventOverflow: { options: { padding: 10 }} }}
            transitionDuration={100}
        >
                <Button
                    text={environment.document.language.name}
                    className="language-selector-button"
                    rightIcon="caret-down"
                    minimal={true}
                />
        </Popover>;
    }

    private renderSyntaxTree(environment: LorgnetteEnvironmentState): ReactElement {
        return <SyntaxTree
            document={environment.document}
            cursorPosition={environment.codeEditorCursorPosition}
            onMouseTargetNodeChange={node =>
                node
                    ? environment.setCodeEditorHoveredRanges([node.range])
                    : environment.setCodeEditorHoveredRanges([])
            }
        />;
    }
    
    render() {
        const OptionalSplitPanels = (props: { children: (ReactElement | null)[] }) => {
            const hasSeveralChildren = Array.isArray(props.children)
                && props.children.filter(element => !!element).length > 1;
                
            const splitProps = {
                className: "panel-container",
                sizes: [70, 30],
                minSize: 250
            };

            return hasSeveralChildren
                ? <Split {...splitProps}>{props.children}</Split>
                : <>{props.children}</>;
        }

        return <LorgnetteContext.Consumer>{ environment => (
            <div className="lorgnette-playground">
                <div className="menu-bar">
                    <div className="example-selector">
                        { this.renderExampleSelector(environment) }
                    </div>
                    <div className="playground-title">
                        { this.renderPlaygroundTitle() }
                    </div>
                    <div className="syntax-tree-visibility-switch">
                        <Switch
                            label="Show syntax tree"
                            defaultChecked={this.state.showSyntaxTree}
                            onChange={event => this.setState({
                                showSyntaxTree: !this.state.showSyntaxTree
                            })}
                            inline={true}
                            alignIndicator={Alignment.RIGHT}
                        />
                    </div>
                </div>
                <OptionalSplitPanels>
                    <div className="code-editor-panel">
                        <MonacoEditorWithProjections />
                    </div>
                    {
                        this.state.showSyntaxTree 
                            ? <div className="syntax-tree-panel">{ this.renderSyntaxTree(environment) }</div>
                            : null
                    }
                </OptionalSplitPanels>
                <div className="status-bar">
                    { this.renderActiveProjectionInfoText(environment) }
                    <div className="cursor-position">
                        { environment.codeEditorCursorPosition.toPrettyString() }
                    </div>
                    <Divider />
                    { this.renderLanguageSelector(environment) }
                </div>
            </div>
        )}</LorgnetteContext.Consumer>
    }
};

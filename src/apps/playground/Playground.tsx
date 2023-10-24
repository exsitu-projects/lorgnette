import React, { ReactElement } from "react";
import Split from "react-split";
import { Popover2 } from "@blueprintjs/popover2";
import { ItemRenderer, Select2 } from "@blueprintjs/select";
import { Button, Checkbox, Label, Menu, MenuItem } from "@blueprintjs/core";
import { Language } from "../../core/languages/Language";
import { SyntaxTree } from "./syntax-tree/SyntaxTree";
import { PlaygroundEditor } from "./PlaygroundEditor";
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

    private renderLanguageSelector(environment: LorgnetteEnvironmentState): ReactElement {
        const renderLanguageSelectorItem: ItemRenderer<Language> = (
            language,
            { handleClick, modifiers }
        ) => {
            if (!modifiers.matchesPredicate) {
                return null;
            }
            
            return <MenuItem
                active={modifiers.active}
                key={language.id}
                text={language.name}
                label={language.id}
                onClick={handleClick}
            />;
        };
            
        const LanguageSelect = Select2.ofType<Language>();
        return <LanguageSelect
            items={environment.languages}
            itemRenderer={renderLanguageSelectorItem}
            onItemSelect={newLanguage => environment.setDocument(new Document(newLanguage, environment.document.content))}
            activeItem={environment.document.language}
            popoverProps={{
                minimal: true,
                usePortal: true,
                portalContainer: document.body
            }}
            className="language-selector"
        >
            <Button text={environment.document.language.name} rightIcon="caret-down" />
        </LanguageSelect>;
        
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
        
        const menu = <Menu className="bp4-menu">
            {EXAMPLES.map(example => renderExampleMenuItem(example))}
        </Menu>;
            
        return <Popover2
            content={menu}
            position="bottom"
            minimal={true}
            popoverClassName="bp4-popover"
            usePortal={true}
            portalContainer={document.body}
        >
            <Button text="Load example..." rightIcon="caret-down" intent="primary" />
        </Popover2>
    }

    private renderProjectionInfoText(projection: Projection): ReactElement {
        const range = projection.range.toPrettyString();
        return <li key={projection.uid}>
            [#{projection.uid}] {projection.provider.name} ({range})
            {/* [#{projection.uid}] {projection.provider.name} */}
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

        if (activeProjections.length === 0) {
            return null;
        }
        else {
            return <>
                <strong>Projections at current position: </strong>
                <ul>
                    {activeProjections.map(projection => this.renderProjectionInfoText(projection))}
                </ul>
            </>
        }
    }

    private renderSyntaxTree(environment: LorgnetteEnvironmentState): ReactElement {
        return <>
            <SyntaxTree
                document={environment.document}
                cursorPosition={environment.codeEditorCursorPosition}
                onMouseTargetNodeChange={node =>
                    node
                        ? environment.setCodeEditorHoveredRanges([node.range])
                        : environment.setCodeEditorHoveredRanges([])
                }
            />
        </>;
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
                    <Label className="language-selector bp4-inline">
                        Language
                        {this.renderLanguageSelector(environment)}
                    </Label>
                    <div className="example-selector">
                        {this.renderExampleSelector(environment)}
                    </div>
                    <Label className="show-syntax-tree-checkbox bp4-inline">
                        Show syntax tree
                        <Checkbox
                            defaultChecked={this.state.showSyntaxTree}
                            onChange={event => this.setState({
                                showSyntaxTree: !this.state.showSyntaxTree
                            })}
                            inline={true}
                        />
                    </Label>
                </div>
                <OptionalSplitPanels>
                    <div className="code-editor-panel">
                        <PlaygroundEditor/>
                        <div className="status-bar">
                            <div className="active-projections-information">
                                {this.renderActiveProjectionInfoText(environment)}
                            </div>
                            <div className="cursor-position">
                                {environment.codeEditorCursorPosition.toPrettyString()}
                            </div>
                        </div>
                    </div>
                    { this.state.showSyntaxTree ? <div className="syntax-tree-panel">
                        {this.renderSyntaxTree(environment)}
                    </div> : null }
                </OptionalSplitPanels>
            </div>
        )}</LorgnetteContext.Consumer>
    }
};

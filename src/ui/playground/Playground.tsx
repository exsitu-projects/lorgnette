import React, { ReactElement } from "react";
import Split from "react-split";
import "./playground.css";
import { Popover2 } from "@blueprintjs/popover2";
import { ItemRenderer, Select2 } from "@blueprintjs/select";
import { Button, Label, Menu, MenuItem } from "@blueprintjs/core";
import { Language, SUPPORTED_LANGUAGES } from "../../core/languages/Language";
import { SyntaxTree } from "./syntax-tree/SyntaxTree";
import { PlaygroundEditor } from "./PlaygroudEditor";
import { DEFAULT_EXAMPLE, Example, EXAMPLES } from "./examples/Example";
import { Monocle } from "../../core/monocles/Monocle";
import { MonocleEnvironment, MonocleEnvironmentContext, MonocleEnvironmentProvider } from "../../MonocleEnvironment";
import { Document } from "../../core/documents/Document";

type Props = {};
type State = {
    currentExample: Example;
};

export class Playground extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            currentExample: DEFAULT_EXAMPLE
        }
    }

    private renderLanguageSelector(environment: MonocleEnvironment): ReactElement {
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
            items={[...SUPPORTED_LANGUAGES]}
            itemRenderer={renderLanguageSelectorItem}
            onItemSelect={newLanguage => environment.updateDocument(new Document(newLanguage, environment.document.content))}
            activeItem={environment.document.language}
            popoverProps={{
                usePortal: true,
                portalContainer: document.body
            }}
            className="language-selector"
        >
            <Button text={environment.document.language.name} rightIcon="caret-down" />
        </LanguageSelect>;
        
    }

    private renderExampleSelector(environment: MonocleEnvironment): ReactElement {
        const renderExampleMenuItem = (example: Example): ReactElement => {
            return <MenuItem
                key={example.name}
                text={example.name}
                onClick={() => {
                    this.setState({ currentExample: example });
                    environment.updateDocument(new Document(example.language, example.content))
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

    private renderMonocleInfoText(monocle: Monocle): ReactElement {
        const range = monocle.range.toPrettyString();
        return <li key={monocle.uid}>
            [#{monocle.uid}] {monocle.provider.name} ({range})
            {/* [#{monocle.uid}] {monocle.provider.name} */}
        </li>;
    }

    private renderActiveMonoclesInfoText(environment: MonocleEnvironment): ReactElement | null {
        // TODO: update how an active monocle is detected!
        const activeMonocles: Monocle[] = [];
        for (let monocle of environment.monocles) {
            if (monocle.range.contains(environment.codeEditorCursorPosition)) {
                activeMonocles.push(monocle);
            }
        }

        if (activeMonocles.length === 0) {
            return null;
        }
        else {
            return <>
                <strong>Active monocles: </strong>
                <ul>
                    {activeMonocles.map(monocle => this.renderMonocleInfoText(monocle))}
                </ul>
            </>
        }
    }

    private renderSyntaxTree(environment: MonocleEnvironment): ReactElement {
        return <>
            <h3>Syntax tree</h3>
            <SyntaxTree
                document={environment.document}
                cursorPosition={environment.codeEditorCursorPosition}
                onMouseTargetNodeChange={node =>
                    node
                        ? environment.updateCodeEditorRanges({ hovered: [node.range] })
                        : environment.updateCodeEditorRanges({ hovered: [] })
                }
            />
        </>;
    }
    
    render() {
        return <MonocleEnvironmentContext.Consumer>{ environment => (
            <Split
                className="playground"
                sizes={[70, 30]}
                minSize={250}
            >
                <div className="code-editor-panel">
                    <div className="menu-bar">
                        <Label className="bp4-inline" style={{ display: "inline-block", margin: 0 }}>
                            Language:
                            {this.renderLanguageSelector(environment)}
                        </Label>
                        {this.renderExampleSelector(environment)}
                    </div>
                    <PlaygroundEditor/>
                    <div className="status-bar">
                        <div className="active-monocles-information">
                            {this.renderActiveMonoclesInfoText(environment)}
                        </div>
                        <div className="cursor-position">
                            {environment.codeEditorCursorPosition.toPrettyString()}
                        </div>
                    </div>
                </div>
                <div className="syntax-tree-panel">
                    {this.renderSyntaxTree(environment)}
                </div>
            </Split>
        )}</MonocleEnvironmentContext.Consumer>
    }
};

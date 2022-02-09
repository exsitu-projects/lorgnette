import React, { ReactElement, ReactFragment } from "react";
import "./monocle-code-editor.css";
import { GlobalContext } from "../../context";
import { CodeVisualisation } from "../../core/visualisations/CodeVisualisation";
import { CodeEditor } from "./CodeEditor";
import { createRangesToHighlightForCodeVisualisations, createRangesToHighlightFromGlobalCodeEditorRanges } from "./RangeToHighlight";
import { Button } from "@blueprintjs/core";
import { Popover2 } from "@blueprintjs/popover2";

export type Props = {

};

type State = {

};

export class MonocleCodeEditor extends React.Component<Props, State> {
    private codeEditorRef: React.RefObject<CodeEditor>;
    private codeVisualisationContainerRef: React.RefObject<HTMLDivElement>;
    private codeVisualisationsToWrapperRefs: Map<CodeVisualisation, React.RefObject<HTMLElement>>;

    constructor(props: Props) {
        super(props);

        this.codeEditorRef = React.createRef();
        this.codeVisualisationContainerRef = React.createRef();
        this.codeVisualisationsToWrapperRefs = new Map();

        this.state = {};
    }

    private resetCodeVisualisationsToWrapperRefsMap(): void {
        this.codeVisualisationsToWrapperRefs.clear();
    }

    private renderLocalCodeVisualisation(codeVisualisation: CodeVisualisation): ReactElement {
        const ref = React.createRef<HTMLDivElement>();
        this.codeVisualisationsToWrapperRefs.set(codeVisualisation, ref);

        const codeVisualisationWrapperElement = <div ref={ref}>
            <Popover2
                placement="right"
                minimal={true}
                transitionDuration={150}
                content={<div style={{ padding: "10px", backgroundColor: "#fafafa"}}>{codeVisualisation.userInterface.createView()}</div>}
                renderTarget={({ isOpen, ref,  ...targetProps }) =>
                    <Button
                        {...targetProps}
                        elementRef={ref as any}
                    >
                        visualisation
                    </Button>
                }
            />
        </div>;

        return codeVisualisationWrapperElement;
    }

    private renderLocalCodeVisualisations(codeVisualisations: CodeVisualisation[]): ReactFragment {
        this.resetCodeVisualisationsToWrapperRefsMap();

        const localCodeVisualisations = codeVisualisations.filter(visualisation => true); // TODO: update this
        const renderedLocalCodeVisualisations = localCodeVisualisations.map(
            visualisation => this.renderLocalCodeVisualisation(visualisation)
        );

        return <>
            {renderedLocalCodeVisualisations}
        </>;
    }

    private repositionLocalCodeVisualisations(): void {
        const codeEditorRef = this.codeEditorRef.current;
        if (!codeEditorRef) {
            return;
        }

        for (let [codeVisualisation, wrapperRef] of this.codeVisualisationsToWrapperRefs.entries()) {
            const ref = wrapperRef.current;
            if (!ref) {
                continue;
            }

            const id = codeVisualisation.id;
            const codeVisualisationBoundingBox = ref.getBoundingClientRect();

            const markerSet = codeEditorRef.getMarkerSetWithId(id);
            const visualisedCodeBoundingBox = markerSet.boundingBox;

            // const top = visualisedCodeBoundingBox.top - (codeVisualisationBoundingBox.height / 2);
            const top = visualisedCodeBoundingBox.top;
            const left = visualisedCodeBoundingBox.right + 20;

            ref.style.position = "absolute";
            ref.style.top = `${top}px`;
            ref.style.left = `${left}px`;
        }
    }

    componentDidMount() {
        this.repositionLocalCodeVisualisations();
    }

    componentDidUpdate(oldProps: Props) {
        if (oldProps === this.props) {
            return;
        }

        this.repositionLocalCodeVisualisations();
    }

    render() {
        return <GlobalContext.Consumer>{ context => (
            <div className="monocle-code-editor-wrapper">
                <CodeEditor
                    language={context.document.language}
                    initialContent={context.document.content}
                    onContentChange={newContent => context.updateDocumentContent(newContent)}
                    onSelectionChange={() => context.updateCodeEditorRanges({ selected: [] })}
                    rangesToHighlight={[
                        ...createRangesToHighlightForCodeVisualisations(context.codeVisualisations),
                        ...createRangesToHighlightFromGlobalCodeEditorRanges(context.codeEditorRanges)
                    ]}
                    ref={this.codeEditorRef}
                />
                <div
                    className="code-visualisations"
                    ref={this.codeVisualisationContainerRef}
                >
                    {this.renderLocalCodeVisualisations(context.codeVisualisations)}
                </div>
            </div>
        )}</GlobalContext.Consumer>
    }
}
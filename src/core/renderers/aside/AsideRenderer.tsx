import React from "react";
import "../renderers.css";
import { Renderer, RendererProps } from "../Renderer";
import { RendererProvider } from "../RendererProvider";
import { GlobalContext } from "../../../context";
import { Position } from "../../documents/Position";
import { AsideRendererPosition, AsideRendererSettings, DEFAULT_ASIDE_RENDERER_SETTINGS, deriveAsideRendererSettingsFrom } from "./AsideRendererSettings";

export class AsideRenderer extends Renderer {
    readonly name: string = "aside";

    protected settings: AsideRendererSettings;
    protected asideWrapperRef: React.RefObject<HTMLDivElement>;

    constructor(props: RendererProps) {
        super(props);

        this.settings = DEFAULT_ASIDE_RENDERER_SETTINGS;
        this.asideWrapperRef = React.createRef();
    }

    protected repositionWrapper(): void {
        // Wait for the next redraw of the webpage before updating the wrapper's position.
        // This is required to ensure that the code editor and the markers are part of the DOM
        // and positioned correctly, which is mandatory for positioning relatively to them.
        window.requestAnimationFrame(() => {
            const wrapperRef = this.asideWrapperRef.current;
            const codeEditorRef = this.props.codeEditorRef.current;

            if (!wrapperRef || !codeEditorRef) {
                console.warn("Code vis. GUIs cannot be repositioned: required React refs are not available.", wrapperRef, codeEditorRef);
                return;
            }

            // Get the bounding box of the code editor.
            const codeEditorBoundingBox = codeEditorRef.getEditorBoundingBox();

            // Get the bounding box of the set of markers associated with the code visualisations
            // (i.e., the areas in the code editor that correspond to this visualisation).
            // If the set is empty, possibly because there has been an update and they have not been redrawn yet,
            // simply skip the repositioning instead of drawing them at an arbitrary position scuh as (0, 0).
            const id = this.props.monocle.uid;
            
            let fragmentBoundingBox = new DOMRect(0, 0, 0, 0);
            try {
                fragmentBoundingBox = codeEditorRef.getDecorationBoundingBoxWithId(id);
            }
            catch (exception) {
                this.repositionWrapper();
                return;
            }

            // Position the wrapper according to the settings.
            const top = fragmentBoundingBox.top - codeEditorBoundingBox.top;
            wrapperRef.style.top = `${top}px`;

            switch (this.settings.position) {
                case AsideRendererPosition.RightSideOfCode:
                    const left = fragmentBoundingBox.right - codeEditorBoundingBox.left + this.settings.positionOffset;
                    wrapperRef.style.left = `${left}px`;
                    wrapperRef.style.removeProperty("right");
                    break;

                case AsideRendererPosition.RightSideOfEditor:
                    const right = this.settings.positionOffset + 120;
                    wrapperRef.style.right = `${right}px`;
                    wrapperRef.style.removeProperty("left");
                    break;
            }

            console.info("repositioned wrapper")
        });
    }

    componentDidMount() {
        this.repositionWrapper();
    }

    componentDidUpdate(oldProps: RendererProps) {
        if (oldProps.codeEditorRef === this.props.codeEditorRef
        &&  oldProps.monocle === this.props.monocle) {
            return;
        }

        this.repositionWrapper();
    }

    render() {
        const isHiddenWithCursorAt = (cursorPosition: Position) => {
            return this.settings.onlyShowWhenCursorIsInRange
                && !(this.props.monocle.range.contains(cursorPosition));
        };

        return <GlobalContext.Consumer>{ context => (
            <div
                className={`monocle-aside-wrapper ${isHiddenWithCursorAt(context.codeEditorCursorPosition) ? "hidden" : ""}`}
                ref={this.asideWrapperRef}
            >
                {this.props.monocle.userInterface.createView()}
            </div>
        )}</GlobalContext.Consumer>;
    }

    static makeProvider(settings: Partial<AsideRendererSettings> = {}): RendererProvider {
        const Renderer = class extends AsideRenderer {
            protected settings = deriveAsideRendererSettingsFrom(settings);
        };

        return {
            provide: () => Renderer
        }
    }
}
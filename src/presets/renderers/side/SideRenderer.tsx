import "./style.css";
import React from "react";
import { Renderer, RendererProps } from "../../../core/renderers/Renderer";
import { ConfigurableRendererProvider, RendererProvider } from "../../../core/renderers/RendererProvider";
import { SideRendererPosition, SideRendererSettings, DEFAULT_ASIDE_RENDERER_SETTINGS, deriveSideRendererSettingsFrom } from "./SideRendererSettings";

export class SideRenderer extends Renderer {
    readonly className: string = "side";
    protected settings: SideRendererSettings;

    constructor(props: RendererProps) {
        super(props);
        this.settings = DEFAULT_ASIDE_RENDERER_SETTINGS;
    }

    get isActive(): boolean {
        return this.settings.onlyShowWhenCursorIsInRange
            ? this.props.projection.range.contains(this.props.codeEditorCursorPosition)
            : this.props.codeEditorVisibleRange.intersects(this.props.projection.range);
    }

    protected get isVisible(): boolean {
        return this.isActive;
    }

    protected reposition(): void {
        this.useBoundingBoxesAfterRedraw(({ codeEditorBox, projectionFragmentBox }) => {
            const wrapperElement = this.rendererWrapperRef.current;
            if (!wrapperElement) {
                return;
            }

            // Position the wrapper according to the settings.
            const top = projectionFragmentBox.top - codeEditorBox.top;
            wrapperElement.style.top = `${top}px`;

            switch (this.settings.position) {
                case SideRendererPosition.RightSideOfCode:
                    const left = projectionFragmentBox.right - codeEditorBox.left + this.settings.positionOffset;
                    wrapperElement.style.left = `${left}px`;
                    wrapperElement.style.removeProperty("right");
                    break;

                case SideRendererPosition.RightSideOfEditor:
                    const right = this.settings.positionOffset + 120;
                    wrapperElement.style.right = `${right}px`;
                    wrapperElement.style.removeProperty("left");
                    break;
            }
        });
    }

    componentDidMount() {
        this.reposition();
    }

    componentDidUpdate(oldProps: RendererProps) {
        if (oldProps.codeEditorRef === this.props.codeEditorRef
        &&  oldProps.projection === this.props.projection
        &&  oldProps.codeEditorVisibleRange === this.props.codeEditorVisibleRange
        &&  oldProps.codeEditorCursorPosition === this.props.codeEditorCursorPosition) {
            return;
        }

        this.reposition();
    }

    renderProjection() {
        return this.props.projection.userInterface.createView();
    }

    static makeConfigurableProvider(): ConfigurableRendererProvider {
        return (settings: Partial<SideRendererSettings> = {}) => {
            return {
                provide: () => class extends SideRenderer {
                    protected settings = deriveSideRendererSettingsFrom(settings);
                }
            }
        };
    }
}
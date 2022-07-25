import React from "react";
import "../renderers.css";
import { Renderer, RendererProps } from "../Renderer";
import { RendererProvider } from "../RendererProvider";
import { AsideRendererPosition, AsideRendererSettings, DEFAULT_ASIDE_RENDERER_SETTINGS, deriveAsideRendererSettingsFrom } from "./AsideRendererSettings";

export class AsideRenderer extends Renderer {
    readonly className: string = "aside";
    protected settings: AsideRendererSettings;

    constructor(props: RendererProps) {
        super(props);
        this.settings = DEFAULT_ASIDE_RENDERER_SETTINGS;
    }

    get isActive(): boolean {
        return this.settings.onlyShowWhenCursorIsInRange
            ? this.props.monocle.range.contains(this.props.codeEditorCursorPosition)
            : this.props.codeEditorVisibleRange.intersects(this.props.monocle.range);
    }

    protected get isVisible(): boolean {
        return this.isActive;
    }

    protected reposition(): void {
        this.useBoundingBoxesAfterRedraw(({ codeEditorBox, monocleFragmentBox }) => {
            const wrapperElement = this.rendererWrapperRef.current;
            if (!wrapperElement) {
                return;
            }

            // Position the wrapper according to the settings.
            const top = monocleFragmentBox.top - codeEditorBox.top;
            wrapperElement.style.top = `${top}px`;

            switch (this.settings.position) {
                case AsideRendererPosition.RightSideOfCode:
                    const left = monocleFragmentBox.right - codeEditorBox.left + this.settings.positionOffset;
                    wrapperElement.style.left = `${left}px`;
                    wrapperElement.style.removeProperty("right");
                    break;

                case AsideRendererPosition.RightSideOfEditor:
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
        &&  oldProps.monocle === this.props.monocle
        &&  oldProps.codeEditorVisibleRange === this.props.codeEditorVisibleRange
        &&  oldProps.codeEditorCursorPosition === this.props.codeEditorCursorPosition) {
            return;
        }

        this.reposition();
    }

    renderMonocle() {
        return this.props.monocle.userInterface.createView();
    }

    static makeProvider(settings: Partial<AsideRendererSettings> = {}): RendererProvider {
        return {
            provide: () => class extends AsideRenderer {
                protected settings = deriveAsideRendererSettingsFrom(settings);
            }
        }
    }
}
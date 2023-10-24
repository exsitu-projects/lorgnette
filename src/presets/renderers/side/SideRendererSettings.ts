import { RendererSettings } from "../../../core/renderers/RendererSettings";

export enum SideRendererPosition {
    RightSideOfCode = "RightSideOfCode",
    RightSideOfEditor = "RightSideOfEditor"
}

export interface SideRendererSettings extends RendererSettings {
    onlyShowWhenCursorIsInRange: boolean;
    position: SideRendererPosition;
    positionOffset: number; // px
};

export const DEFAULT_ASIDE_RENDERER_SETTINGS: SideRendererSettings = {
    onlyShowWhenCursorIsInRange: false,
    position: SideRendererPosition.RightSideOfCode,
    positionOffset: 10
};

export const deriveSideRendererSettingsFrom = (partialSettings: Partial<SideRendererSettings>): SideRendererSettings => {
    return {
        ...DEFAULT_ASIDE_RENDERER_SETTINGS,
        ...partialSettings
    };
};
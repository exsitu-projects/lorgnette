export enum AsideRendererPosition {
    RightSideOfCode = "RightSideOfCode",
    RightSideOfEditor = "RightSideOfEditor"
}

export interface AsideRendererSettings {
    onlyShowWhenCursorIsInRange: boolean;
    position: AsideRendererPosition;
    positionOffset: number; // px
};

export const DEFAULT_ASIDE_RENDERER_SETTINGS: AsideRendererSettings = {
    onlyShowWhenCursorIsInRange: false,
    position: AsideRendererPosition.RightSideOfCode,
    positionOffset: 10
};

export const deriveAsideRendererSettingsFrom = (partialSettings: Partial<AsideRendererSettings>): AsideRendererSettings => {
    return {
        ...DEFAULT_ASIDE_RENDERER_SETTINGS,
        ...partialSettings
    };
};
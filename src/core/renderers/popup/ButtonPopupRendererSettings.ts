import { ButtonProps } from "@blueprintjs/core";
import { ReactElement } from "react";

export type ButtonContent = string | ReactElement;

export interface ButtonPopupRendererSettings {
    buttonContent: ButtonContent;
    buttonProps: ButtonProps;
};

export const DEFAULT_BUTTON_POPUP_RENDERER_SETTINGS: ButtonPopupRendererSettings = {
    buttonContent: "🔎",
    buttonProps: {}
};

export const deriveButtonPopupRendererSettingsFrom = (partialSettings: Partial<ButtonPopupRendererSettings>): ButtonPopupRendererSettings => {
    return {
        ...DEFAULT_BUTTON_POPUP_RENDERER_SETTINGS,
        ...partialSettings
    };
};
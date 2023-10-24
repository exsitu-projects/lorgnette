import { ButtonProps } from "@blueprintjs/core";
import { ReactElement } from "react";
import { RendererSettings } from "../../../core/renderers/RendererSettings";

export type ButtonContent = string | ReactElement;

export interface ButtonPopoverRendererSettings extends RendererSettings {
    buttonContent: ButtonContent;
    buttonProps: ButtonProps;
};

export const DEFAULT_BUTTON_POPOVER_RENDERER_SETTINGS: ButtonPopoverRendererSettings = {
    buttonContent: "🔎",
    buttonProps: {}
};

export const deriveButtonPopoverRendererSettingsFrom = (partialSettings: Partial<ButtonPopoverRendererSettings>): ButtonPopoverRendererSettings => {
    return {
        ...DEFAULT_BUTTON_POPOVER_RENDERER_SETTINGS,
        ...partialSettings
    };
};
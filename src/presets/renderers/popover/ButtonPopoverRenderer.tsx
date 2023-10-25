import "./popover-renderer.css";
import React, { ReactElement } from "react";
import { Button, PopoverTargetProps } from "@blueprintjs/core";
import { PopoverRenderer } from "./PopoverRenderer";
import { ConfigurableRendererProvider, RendererProvider } from "../../../core/renderers/RendererProvider";
import { ButtonPopoverRendererSettings, DEFAULT_BUTTON_POPOVER_RENDERER_SETTINGS, deriveButtonPopoverRendererSettingsFrom } from "./ButtonPopoverRendererSettings";
import { RendererProps } from "../../../core/renderers/Renderer";

export class ButtonPopoverRenderer extends PopoverRenderer {
    readonly className: string = "popover button-popover";
    protected settings: ButtonPopoverRendererSettings;

    constructor(props: RendererProps) {
        super(props);
        this.settings = DEFAULT_BUTTON_POPOVER_RENDERER_SETTINGS;
    }

    protected renderPopoverTarget(props: PopoverTargetProps): ReactElement {
        const { isOpen, ref, ...targetProps } = props;
        return <Button
            {...this.settings.buttonProps}
            ref={props.ref as any}
            {...targetProps}
        >
            {this.settings.buttonContent}
        </Button>;
    }

    static makeConfigurableProvider(): ConfigurableRendererProvider {
        return (settings: Partial<ButtonPopoverRendererSettings> = {}) => {
            return {
                provide: () => class extends ButtonPopoverRenderer {
                    protected settings = deriveButtonPopoverRendererSettingsFrom(settings);
                }
            }
        };
    }
}

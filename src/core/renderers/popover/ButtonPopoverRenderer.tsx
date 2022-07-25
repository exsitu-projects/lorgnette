import React, { ReactElement } from "react";
import "../renderers.css";
import { Button } from "@blueprintjs/core";
import { Popover2TargetProps } from "@blueprintjs/popover2";
import { PopoverRenderer } from "./PopoverRenderer";
import { RendererProvider } from "../RendererProvider";
import { ButtonPopoverRendererSettings, DEFAULT_BUTTON_POPOVER_RENDERER_SETTINGS, deriveButtonPopoverRendererSettingsFrom } from "./ButtonPopoverRendererSettings";
import { RendererProps } from "../Renderer";

export class ButtonPopoverRenderer extends PopoverRenderer {
    readonly className: string = "popover button-popover";
    protected settings: ButtonPopoverRendererSettings;

    constructor(props: RendererProps) {
        super(props);
        this.settings = DEFAULT_BUTTON_POPOVER_RENDERER_SETTINGS;
    }

    protected renderPopoverTarget(props: Popover2TargetProps): ReactElement {
        const { isOpen, ref, ...targetProps } = props;
        return <Button
            {...this.settings.buttonProps}
            elementRef={props.ref as any}
            {...targetProps}
        >
            {this.settings.buttonContent}
        </Button>;
    }

    static makeProvider(settings: Partial<ButtonPopoverRendererSettings> = {}): RendererProvider {
        return {
            provide: () => class extends ButtonPopoverRenderer {
                protected settings = deriveButtonPopoverRendererSettingsFrom(settings);
            }
        }
    }
}

import React, { ReactElement } from "react";
import "../renderers.css";
import { Button } from "@blueprintjs/core";
import { PopupRenderer } from "./PopupRenderer";
import { RendererProvider } from "../RendererProvider";
import { ButtonPopupRendererSettings, DEFAULT_BUTTON_POPUP_RENDERER_SETTINGS, deriveButtonPopupRendererSettingsFrom } from "./ButtonPopupRendererSettings";
import { RendererProps } from "../Renderer";


export class ButtonPopupRenderer extends PopupRenderer {
    readonly name: string = "button-popup";
    protected settings: ButtonPopupRendererSettings;

    constructor(props: RendererProps) {
        super(props);
        this.settings = DEFAULT_BUTTON_POPUP_RENDERER_SETTINGS;
    }

    protected renderPopupToggle(): ReactElement {
        return <Button
            {...this.settings.buttonProps}
            onClick={() => {
                console.log("set is open state", !this.state.isPopupOpen)
                this.setState({ isPopupOpen: !this.state.isPopupOpen })
            }}
        >
            {this.settings.buttonContent}
        </Button>;
    }

    static makeProvider(settings: Partial<ButtonPopupRendererSettings> = {}): RendererProvider {
        const Renderer = class extends ButtonPopupRenderer {
            protected settings = deriveButtonPopupRendererSettingsFrom(settings);
        };

        return {
            provide: () => Renderer
        }
    }
}

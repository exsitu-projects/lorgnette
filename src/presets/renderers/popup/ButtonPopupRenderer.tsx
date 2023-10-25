import "./popup-renderer.css";
import React, { ReactElement } from "react";
import { Button } from "@blueprintjs/core";
import { PopupRenderer } from "./PopupRenderer";
import { ConfigurableRendererProvider } from "../../../core/renderers/RendererProvider";
import { ButtonPopupRendererSettings, DEFAULT_BUTTON_POPUP_RENDERER_SETTINGS, deriveButtonPopupRendererSettingsFrom } from "./ButtonPopupRendererSettings";
import { RendererProps } from "../../../core/renderers/Renderer";


export class ButtonPopupRenderer extends PopupRenderer {
    readonly className: string = "popup button-popup";
    protected settings: ButtonPopupRendererSettings;

    constructor(props: RendererProps) {
        super(props);
        this.settings = DEFAULT_BUTTON_POPUP_RENDERER_SETTINGS;
    }

    protected renderPopupToggle(): ReactElement {
        return <Button
            {...this.settings.buttonProps}
            onClick={() => {
                this.setState({ isPopupOpen: !this.state.isPopupOpen })
            }}
        >
            {this.settings.buttonContent}
        </Button>;
    }

    static makeConfigurableProvider(): ConfigurableRendererProvider {
        return (settings: Partial<ButtonPopupRendererSettings> = {}) => {
            return {
                provide: () => class extends ButtonPopupRenderer {
                    protected settings = deriveButtonPopupRendererSettingsFrom(settings);
                }
            }
        };
    }
}

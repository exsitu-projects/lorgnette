import React, { ReactElement } from "react";
import "./popover-renderer.css";
import { Button, ButtonProps } from "@blueprintjs/core";
import { Popover2TargetProps } from "@blueprintjs/popover2";
import { PopoverRenderer } from "./PopoverRenderer";
import { RendererProvider } from "../RendererProvider";

export type ButtonContent = string | ReactElement;

export class ButtonPopoverRenderer extends PopoverRenderer {
    readonly name: string = "button-popover";

    protected get buttonContent(): ButtonContent {
        return "";
    }

    protected get buttonProps(): ButtonProps {
        return {};
    }

    protected renderPopoverTarget(props: Popover2TargetProps): ReactElement {
        const { isOpen, ref, ...targetProps } = props;
        return <Button
            {...this.buttonProps}
            elementRef={props.ref as any}
            {...targetProps}
        >
            {this.buttonContent}
        </Button>;
    }

    static makeProvider(content: ButtonContent, props: ButtonProps = {}): RendererProvider {
        const Renderer = class extends ButtonPopoverRenderer {
            protected get buttonContent(): ButtonContent {
                return content;
            }
        
            protected get buttonProps(): ButtonProps {
                return props;
            }
        };

        return {
            provide: () => Renderer
        }
    }
}

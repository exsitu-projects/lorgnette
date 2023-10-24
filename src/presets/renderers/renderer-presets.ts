import { LorgnetteEnvironment } from "../../core/lorgnette/LorgnetteEnvironment";
import { ConfigurableRendererProvider } from "../../core/renderers/RendererProvider";
import { ButtonPopoverRenderer } from "./popover/ButtonPopoverRenderer";
import { ButtonPopupRenderer } from "./popup/ButtonPopupRenderer";
import { SideRenderer } from "./side/SideRenderer";

export const RENDERER_PRESETS = {
    "side": SideRenderer.makeConfigurableProvider(),
    "button-popup": ButtonPopupRenderer.makeConfigurableProvider(),
    "button-popover": ButtonPopoverRenderer.makeConfigurableProvider(),
} as const;

import { ClassOf } from "../../utilities/types";
import { Renderer } from "./Renderer";
import { RendererSettings } from "./RendererSettings";

export interface RendererProvider {
    provide(): ClassOf<Renderer>;
}

export type ConfigurableRendererProvider<
    S extends RendererSettings = RendererSettings
> = (settings: S) => RendererProvider;

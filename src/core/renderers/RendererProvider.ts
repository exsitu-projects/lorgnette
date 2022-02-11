import { ClassOf } from "../../utilities/types";
import { Renderer } from "./Renderer";

export interface RendererProvider {
    provide(): ClassOf<Renderer>;
}
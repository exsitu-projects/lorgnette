import { CodeVisualisation } from "../visualisations/CodeVisualisation";
import { UserInterface, UserInterfaceInput, UserInterfaceOutput } from "./UserInterface";

export interface UserInterfaceProvider<
    I extends UserInterfaceInput = UserInterfaceInput,
    O extends UserInterfaceOutput = UserInterfaceOutput
> {
    provide(visualisation: CodeVisualisation): UserInterface<I, O>;
}
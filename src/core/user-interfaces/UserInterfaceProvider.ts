import { Monocle } from "../visualisations/Monocle";
import { UserInterface, UserInterfaceInput, UserInterfaceOutput } from "./UserInterface";

export interface UserInterfaceProvider<
    I extends UserInterfaceInput = UserInterfaceInput,
    O extends UserInterfaceOutput = UserInterfaceOutput
> {
    provideForMonocle(monocle: Monocle): UserInterface<I, O>;
}
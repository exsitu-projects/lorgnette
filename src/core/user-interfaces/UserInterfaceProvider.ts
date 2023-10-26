import { Projection } from "../projections/Projection";
import { UserInterface, UserInterfaceInput, UserInterfaceOutput } from "./UserInterface";
import { UserInterfaceSettings } from "./UserInterfaceSettings";

export interface UserInterfaceProvider<
    I extends UserInterfaceInput = UserInterfaceInput,
    O extends UserInterfaceOutput = UserInterfaceOutput
> {
    provide(projection: Projection): UserInterface<I, O>;
}

export type ConfigurableUserInterfaceProvider<
S extends UserInterfaceSettings = UserInterfaceSettings,
    I extends UserInterfaceInput = UserInterfaceInput,
    O extends UserInterfaceOutput = UserInterfaceOutput
> = (settings: S) => UserInterfaceProvider<I, O>;

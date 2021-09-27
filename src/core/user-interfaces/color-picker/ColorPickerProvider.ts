import { CodeVisualisation } from "../../visualisations/CodeVisualisation";
import { UserInterface, UserInterfaceInput, UserInterfaceOutput } from "../UserInterface";
import { UserInterfaceProvider } from "../UserInterfaceProvider";
import { ColorPicker } from "./ColorPicker";

export class ColorPickerProvider implements UserInterfaceProvider {
    provide(visualisation: CodeVisualisation): UserInterface<UserInterfaceInput, UserInterfaceOutput> {
        return new ColorPicker(visualisation);
    }

}
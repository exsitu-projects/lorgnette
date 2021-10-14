import { CodeVisualisation } from "../../visualisations/CodeVisualisation";
import { UserInterface, UserInterfaceInput, UserInterfaceOutput } from "../UserInterface";
import { UserInterfaceProvider } from "../UserInterfaceProvider";
import { InputPrinter } from "./InputPrinter";

export class InputPrinterProvider implements UserInterfaceProvider {
    provide(visualisation: CodeVisualisation): UserInterface<UserInterfaceInput, UserInterfaceOutput> {
        return new InputPrinter(visualisation);
    }

}
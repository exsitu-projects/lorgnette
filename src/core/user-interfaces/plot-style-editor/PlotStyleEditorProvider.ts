import { CodeVisualisation } from "../../visualisations/CodeVisualisation";
import { UserInterface, UserInterfaceInput, UserInterfaceOutput } from "../UserInterface";
import { UserInterfaceProvider } from "../UserInterfaceProvider";
import { PlotStyleEditor } from "./PlotStyleEditor";

export class PlotStyleEditorProvider implements UserInterfaceProvider {
    provide(visualisation: CodeVisualisation): UserInterface<UserInterfaceInput, UserInterfaceOutput> {
        return new PlotStyleEditor(visualisation);
    }

}
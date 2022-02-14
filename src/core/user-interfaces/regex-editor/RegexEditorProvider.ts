import { CodeVisualisation } from "../../visualisations/CodeVisualisation";
import { UserInterface, UserInterfaceInput, UserInterfaceOutput } from "../UserInterface";
import { UserInterfaceProvider } from "../UserInterfaceProvider";
import { RegexEditor } from "./RegexEditor";

export class RegexEditorProvider implements UserInterfaceProvider {
    provide(visualisation: CodeVisualisation): UserInterface<UserInterfaceInput, UserInterfaceOutput> {
        return new RegexEditor(visualisation, true);
    }
}
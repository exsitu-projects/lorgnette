import { CodeVisualisation } from "../../visualisations/CodeVisualisation";
import { UserInterface, UserInterfaceInput, UserInterfaceOutput } from "../UserInterface";
import { UserInterfaceProvider } from "../UserInterfaceProvider";
import { Tree } from "./Tree";

export class TreeProvider implements UserInterfaceProvider {
    provide(visualisation: CodeVisualisation): UserInterface<UserInterfaceInput, UserInterfaceOutput> {
        return new Tree(visualisation);
    }

}
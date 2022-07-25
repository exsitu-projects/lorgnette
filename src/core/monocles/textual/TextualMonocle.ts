import { ClassOf } from "../../../utilities/types";
import { InputMapping } from "../../mappings/InputMapping";
import { OutputMapping } from "../../mappings/OutputMapping";
import { UserInterfaceProvider } from "../../user-interfaces/UserInterfaceProvider";
import { Monocle, MonocleState } from "../Monocle";
import { TextualMonocleProvider } from "./TextualMonocleProvider";
import { Renderer } from "../../renderers/Renderer";
import { Document } from "../../documents/Document";
import { TextualFragment } from "../../fragments/textual/TextualFragment";

export class TextualMonocle extends Monocle<TextualFragment> {
    constructor(
        provider: TextualMonocleProvider,
        document: Document,
        fragment: TextualFragment,
        inputMapping: InputMapping<TextualFragment>,
        outputMapping: OutputMapping<TextualFragment>,
        userInterfaceProvider: UserInterfaceProvider,
        renderer: ClassOf<Renderer>,
        initialState?: MonocleState
    ) {
        super(
            document,
            provider,
            fragment,
            inputMapping,
            outputMapping,
            userInterfaceProvider,
            renderer,
            initialState
        );
    }
}

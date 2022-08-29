import { ClassOf } from "../../../utilities/types";
import { InputMapping } from "../../mappings/InputMapping";
import { OutputMapping } from "../../mappings/OutputMapping";
import { UserInterfaceProvider } from "../../user-interfaces/UserInterfaceProvider";
import { Monocle, MonocleState } from "../Monocle";
import { TextualMonocleProvider } from "./TextualMonocleProvider";
import { Renderer } from "../../renderers/Renderer";
import { Document } from "../../documents/Document";
import { TextualFragment } from "../../fragments/textual/TextualFragment";
import { RuntimeRequest } from "../../runtime/RuntimeRequest";

export class TextualMonocle extends Monocle<TextualFragment> {
    constructor(
        provider: TextualMonocleProvider,
        document: Document,
        fragment: TextualFragment,
        runtimeRequests: RuntimeRequest[],
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
            runtimeRequests,
            inputMapping,
            outputMapping,
            userInterfaceProvider,
            renderer,
            initialState
        );
    }
}

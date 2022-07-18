import { ClassOf } from "../../../utilities/types";
import { InputMapping } from "../../mappings/InputMapping";
import { OutputMapping } from "../../mappings/OutputMapping";
import { UserInterfaceProvider } from "../../user-interfaces/UserInterfaceProvider";
import { CodeFragmentType } from "../CodeFragmentType";
import { Monocle } from "../Monocle";
import { TextualMonocleProvider } from "./TextualMonocleProvider";
import { Renderer } from "../../renderers/Renderer";
import { Document } from "../../documents/Document";
import { TextualPattern } from "../../code-patterns/textual/TextualPattern";

export class TextualMonocle extends Monocle<CodeFragmentType.Textual> {
    constructor(
        provider: TextualMonocleProvider,
        document: Document,
        pattern: TextualPattern,
        inputMapping: InputMapping<CodeFragmentType.Textual>,
        outputMapping: OutputMapping<CodeFragmentType.Textual>,
        userInterfaceProvider: UserInterfaceProvider,
        renderer: ClassOf<Renderer>
    ) {
        super(
            document,
            provider,
            pattern,
            inputMapping,
            outputMapping,
            userInterfaceProvider,
            renderer
        );
    }
}
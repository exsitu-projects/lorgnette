import { LorgnetteEnvironment } from "../../core/lorgnette/LorgnetteEnvironment";
import { ColorPicker } from "./color-picker/ColorPicker";
import { Form } from "./form/Form";
import { ObjectInspector } from "./object-inspector/ObjectInspector";
import { RegexEditor } from "./regex-editor/RegexEditor";
import { StyleInspector } from "./style-inspector/StyleInspector";
import { Table } from "./table/Table";
import { Tree } from "./tree/Tree";
import { ValueHistory } from "./value-history/ValueHistory";

export const USER_INTERFACE_PRESETS = {
    "object-inspector": ObjectInspector.makeConfigurableProvider(),
    "color-picker": ColorPicker.makeConfigurableProvider(),
    "table": Table.makeConfigurableProvider(),
    "form": Form.makeConfigurableProvider(),
    "tree": Tree.makeConfigurableProvider(),
    "regex-editor": RegexEditor.makeConfigurableProvider(),
    "value-history": ValueHistory.makeConfigurableProvider(),
    "style-inspector": StyleInspector.makeConfigurableProvider(),
} as const;

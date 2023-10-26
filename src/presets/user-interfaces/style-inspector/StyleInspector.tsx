
import { Projection } from "../../../core/projections/Projection";
import { UserInterface, UserInterfaceInput, UserInterfaceOutput } from "../../../core/user-interfaces/UserInterface";
import { ConfigurableUserInterfaceProvider } from "../../../core/user-interfaces/UserInterfaceProvider";
import { Style } from "./Style";
import { StyleInspectorChangeHandler, StyleInspectorComponent } from "./StyleInspectorComponent";
import { DEFAULT_STYLE_INSPECTOR_SETTINGS, deriveStyleInspectorSettingsFromDefaults, PartialStyleInspectorSettings, StyleInspectorSettings } from "./StyleInspectorSettings";

export interface Input extends UserInterfaceInput {
    style: Style;
    settings?: PartialStyleInspectorSettings;
}

export interface Output extends UserInterfaceOutput {
    style: Style;
    styleChange: Style;
}

export class StyleInspector extends UserInterface<Input, Output> {
    readonly className = "style-inspector";

    private style: Style;
    private lastStyleChange: Style;

    private settings: StyleInspectorSettings;

    constructor(projection: Projection) {
        super(projection);

        this.style = {};
        this.lastStyleChange = {};

        this.settings = DEFAULT_STYLE_INSPECTOR_SETTINGS;
    }

    protected get minDelayBetweenModelChangeNotifications(): number {
        return 100; // ms
    }

    setStateFromInput(input: Input): void {
        this.style = input.style;
        this.settings = deriveStyleInspectorSettingsFromDefaults(input.settings ?? {});
    }

    createViewContent(): JSX.Element {
        const onChange: StyleInspectorChangeHandler = (
            styleChange: Style,
            newStyle: Style
        ) => {
            this.style = newStyle;
            this.lastStyleChange = styleChange;
            this.declareModelChange();
        };

        const onTransientChangeStart = () => {
            this.beginTransientState();
        };

        const onTransientChangeEnd = () => {
            this.endTransientState();
            this.declareModelChange(true);
        };

        return <StyleInspectorComponent 
            style={this.style}
            settings={this.settings}
            onChange={onChange}
            onTransientChangeStart={onTransientChangeStart}
            onTransientChangeEnd={onTransientChangeEnd}
        />;
    }

    protected get modelOutput(): Output {
        return {
            style: this.style,
            styleChange: this.lastStyleChange
        };
    }

    protected processInput(input: Input): void {
        // TODO: check input
        this.setStateFromInput(input);
    }

    static makeConfigurableProvider(): ConfigurableUserInterfaceProvider {
        return (settings: Partial<StyleInspectorSettings> = {}) => {
            return {
                provide: (projection: Projection) => {
                    return new StyleInspector(projection);
                }
            };  
        };
    }
}

import { BLACK, Color } from "../../../utilities/Color";
import { RgbColorPicker } from "../../../utilities/components/color-pickers/RgbColorPicker";
import { Projection } from "../../../core/projections/Projection";
import { UserInterface, UserInterfaceOutput } from "../../../core/user-interfaces/UserInterface";
import { ConfigurableUserInterfaceProvider } from "../../../core/user-interfaces/UserInterfaceProvider";
import { UserInterfaceSettings } from "../../../core/user-interfaces/UserInterfaceSettings";

export interface Input extends UserInterfaceOutput {
    color: Color
}

export interface Output extends UserInterfaceOutput {
    color: Color
}

export class ColorPicker extends UserInterface<Input, Output> {
    readonly className = "color-picker";
    private color: Color;

    constructor(projection: Projection, color: Color = BLACK) {
        super(projection);
        this.color = color;
    }

    protected get minDelayBetweenModelChangeNotifications(): number {
        return 100; // ms
    }

    setColor(newColor: Color): void {
        this.color = newColor;
    }

    createViewContent(): JSX.Element {
        const onChange = (newColor: Color) => {
            this.color = newColor;
            this.declareModelChange();
        };

        const onDragStart = () => {
            // this.isCurrentlyUsed = true;
            this.beginTransientState();
        };

        const onDragEnd = () => {
            // this.isCurrentlyUsed = false;
            this.endTransientState();
            this.declareModelChange(true);
        };

        return <RgbColorPicker
            color={this.color}
            onChange={onChange}
            onDragStart={onDragStart}
            onDragEnd={onDragEnd}
        />;
    }

    protected get modelOutput(): Output {
        return {
            color: this.color
        };
    }

    protected processInput(input: Input): void {
        // TODO: check input
        this.setColor(input.color);
    }

    static makeConfigurableProvider(): ConfigurableUserInterfaceProvider {
        return (settings: Partial<UserInterfaceSettings> = {}) => {
            return {
                provide: (projection: Projection) => {
                    return new ColorPicker(projection);
                }
            };  
        };
    }
}
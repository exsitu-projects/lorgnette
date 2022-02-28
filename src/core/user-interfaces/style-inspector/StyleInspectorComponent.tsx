import React, { ReactElement, ReactFragment } from "react";
import "./style-inspector.css";
import { StyleInspectorSettings } from "./StyleInspectorSettings";
import { Style } from "./Style";
import { SpecialisedStyleInspectorProps } from "./inspectors/SpecialisedStyleInspector";
import { BackgroundInspector } from "./inspectors/BackgroundInspector";
import { FontInspector } from "./inspectors/FontInspector";
import { BorderInspector } from "./inspectors/BorderInspector";
import { MarginInspector } from "./inspectors/MarginInspector";

type StyleKeys = keyof Style;
type InspectorPropsForStyleKey<K extends keyof Style> = SpecialisedStyleInspectorProps<NonNullable<Style[K]>>;
type InspectorForStyleKey<K extends keyof Style> = (props: InspectorPropsForStyleKey<K>) => ReactElement;

export type StyleInspectorChangeHandler = (
    styleChange: Style,
    newStyle: Style,
    isTransient: boolean
) => void;

type Props = {
    style: Style;
    settings: StyleInspectorSettings;
    onChange: StyleInspectorChangeHandler;
    onTransientChangeStart: () => void;
    onTransientChangeEnd: () => void;
};

export class StyleInspectorComponent extends React.PureComponent<Props> {
    private isInTransientState: boolean;

    constructor(props: Props) {
        super(props);
        this.isInTransientState = false;
    }

    private processChange(styleChange: Style, updateTransientStateTo?: boolean): void {
        if (updateTransientStateTo !== undefined) {
            if (!this.isInTransientState && updateTransientStateTo === true) {
                this.isInTransientState = true;
                this.props.onTransientChangeStart();
            }
            else if (this.isInTransientState && updateTransientStateTo === false) {
                this.isInTransientState = false;
                this.props.onTransientChangeEnd();
            }
        }

        const newStyle = {
            ...this.props.style,
            ...styleChange
        };

        this.props.onChange(styleChange, newStyle, this.isInTransientState);
    }

    private renderSpecialisedInspector<K extends StyleKeys>(
        key: K,
        inspector: InspectorForStyleKey<K>
    ): ReactElement | null {
        const properties = this.props.style[key];
        if (properties) {
            return inspector({
                properties: this.props.style[key]!,
                onPropertyChange: modifiedProperties => {
                    this.processChange({ [key]: modifiedProperties });
                },
                onTransientChangeStart: () => { this.isInTransientState = true; },
                onTransientChangeEnd: () => { this.isInTransientState = false; },
            });
        }
        else if (this.props.settings.inspectors[key].showWithDefaultValues) {
            return inspector({
                properties: this.props.settings.defaultStyle[key]!,
                onPropertyChange: modifiedProperties => {
                    this.processChange({ [key]: modifiedProperties });
                },
                onTransientChangeStart: () => { this.isInTransientState = true; },
                onTransientChangeEnd: () => { this.isInTransientState = false; },
            });
        }
        else {
            return null;
        }
    }

    private renderSpecialisedInspectors(): ReactFragment {
        const stylePropertyKeysToInspectors: { [K in StyleKeys]: InspectorForStyleKey<K>} = {
            background: props => <BackgroundInspector {...props} />,
            border: props => <BorderInspector {...props} />,
            font: props => <FontInspector {...props} />,
            margin: props => <MarginInspector {...props} />,
        };


        const inspectors = Object.entries(stylePropertyKeysToInspectors)
            .map(([key, inspector]) => this.renderSpecialisedInspector(key as any, inspector));
        
        return <>{inspectors}</>;
    }

    render() {
        return this.renderSpecialisedInspectors();
    }
}
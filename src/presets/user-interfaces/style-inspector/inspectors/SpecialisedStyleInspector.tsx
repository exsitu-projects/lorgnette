import { FormGroup, FormGroupProps } from "@blueprintjs/core";
import React, { ReactElement } from "react";

export const DISABLED_PROPERTY = Symbol("Disable property in a style inspector");
export type SpecialisedStyleInspectorPropertyValue<T = any> = T | typeof DISABLED_PROPERTY;

export function isDisabled(property: any): property is typeof DISABLED_PROPERTY {
    return property === DISABLED_PROPERTY;
}

export function isEnabledAndDefined<
    T extends undefined | typeof DISABLED_PROPERTY,
    U extends Exclude<any, T>
>(property: U | undefined | typeof DISABLED_PROPERTY): property is U {
    return property !== undefined && !isDisabled(property);
}

export type SpecialisedStyleInspectorProperties<
    T extends Record<any, any> = Record<any, any>
> = { [K in keyof T]: SpecialisedStyleInspectorPropertyValue<T[K]> };

type PropertyEditorRenderer<P extends SpecialisedStyleInspectorProperties, K extends keyof P> =
    (propertyValue: Exclude<P[K], undefined | typeof DISABLED_PROPERTY>, isDisabled: boolean) => ReactElement

export type SpecialisedStyleInspectorPropertyChangeHandler<P extends SpecialisedStyleInspectorProperties> = (
    modifiedProperties: Partial<P>
) => void;

export interface SpecialisedStyleInspectorProps<P extends SpecialisedStyleInspectorProperties> {
    properties: P;
    onPropertyChange: SpecialisedStyleInspectorPropertyChangeHandler<P>;
    onTransientChangeStart: () => void;
    onTransientChangeEnd: () => void;
}

export abstract class SpecialisedStyleInspector<
    P extends SpecialisedStyleInspectorProperties
> extends React.PureComponent<SpecialisedStyleInspectorProps<P>> {
    
    protected abstract get title(): string;
    protected abstract get className(): string;

    protected abstract renderEditor(): ReactElement;

    protected get properties(): P {
        return this.props.properties;
    }

    protected hasProperty(propertyName: keyof P): boolean {
        return propertyName in this.props.properties
            && this.props.properties[propertyName] !== undefined;
    }

    protected isPropertyDisabled(propertyName: keyof P): boolean {
        return this.props.properties[propertyName] === DISABLED_PROPERTY;
    }

    protected getProperty<K extends keyof P>(propertyName: K): P[K] | undefined {
        return this.props.properties[propertyName];
    }

    protected changeProperties(modifiedProperties: Partial<P>): void {
        this.props.onPropertyChange(modifiedProperties);
    }

    protected startTransientChange(): void {
        this.props.onTransientChangeStart();
    }

    protected endTransientChange(): void {
        this.props.onTransientChangeEnd();
    }

    protected renderProperty<K extends keyof P>(configuration: {
        propertyName: K,
        renderer: PropertyEditorRenderer<P, K>,
        formGroup?: FormGroupProps
    }): ReactElement | null {
        if (!this.hasProperty(configuration.propertyName)) {
            return null;
        }

        const propertyValue = this.getProperty(configuration.propertyName)!;
        const isDisabled = this.isPropertyDisabled(configuration.propertyName);

        const propertyEditor = configuration.renderer(propertyValue, isDisabled);
        if (configuration.formGroup === undefined) {
            return propertyEditor;
        }

        return <FormGroup
            label={configuration.formGroup.label}
            className={configuration.formGroup.className}
            disabled={isDisabled}
        >
            {propertyEditor}
        </FormGroup>;
    }

    render() {
        return <div className={`specialised-style-inspector ${this.className}`}>
            <div className="title">{this.title}</div>
            <div className="editor">
                {this.renderEditor()}
            </div>
        </div>;
    }
}
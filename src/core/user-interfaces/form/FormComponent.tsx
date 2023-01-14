import React, { Component, ReactElement } from "react";

export interface Props {};
export interface State {};

export abstract class FormComponent extends Component<Props, State> {
    protected title: string | null;

    constructor(props: Props) {
        super(props);
        this.title = null;
    }

    renderFormHeader(): ReactElement | null {
        return this.title
            ? <span className="form-title">{ this.title }</span>
            : null;
    }

    abstract renderFormContent(): ReactElement | null;

    render() {
        return <div className="form-toplevel-container">
            { this.renderFormHeader() }
            { this.renderFormContent() }
        </div>;
    }
}
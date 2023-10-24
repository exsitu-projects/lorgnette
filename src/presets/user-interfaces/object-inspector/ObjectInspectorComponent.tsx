import React, { Component } from "react";
import ReactJson from "react-json-view"

type Props = {
    initialInput: object;
};

type State = {
    input: object;
};

export class ObjectInspectorComponent extends Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            input: props.initialInput
        };
    }

    render() {
        return <ReactJson
            src={this.state.input}
            name={null}
            quotesOnKeys={false}
            enableClipboard={false}
            indentWidth={2}
            collapsed={3}
            collapseStringsAfterLength={8}
        />
    }
}
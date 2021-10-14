import React from "react";
import ReactJson from 'react-json-view'

type Props = {
    input: object;
};

export class InputPrinterComponent extends React.PureComponent<Props> {
    render() {
        return <div className="ui input-printer">
            <ReactJson
                src={this.props.input}
                name={null}
                quotesOnKeys={false}
                enableClipboard={false}
                indentWidth={2}
                collapsed={3}
                collapseStringsAfterLength={8}
            />
        </div>;
    }
}
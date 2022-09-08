import React, { Component } from "react";
import { HotTable } from "@handsontable/react";
import { registerAllModules } from 'handsontable/registry';
import { TableData } from "./Table";
import "handsontable/dist/handsontable.full.css";
import "./table.css";

// register Handsontable's modules
registerAllModules();

type Props = {
    data: TableData;
};

type State = {
    data: TableData;
};

export class TableComponent extends Component<Props, State> {
    private handsontable: HotTable | null;

    constructor(props: Props) {
        super(props);

        this.handsontable = null;
        this.state = {
            data: props.data
        };
    }

    setTableData(data: TableData): void {
        this.setState({
            data: data
        });
    }

    private updateTableDimensions(): void {
        this.handsontable?.hotInstance?.refreshDimensions();
    }

    componentDidMount(): void {
        this.updateTableDimensions();
    }

    componentDidUpdate(previousProps: Readonly<Props>, previousState: Readonly<State>): void {
        if (previousState.data !== this.state.data) {
            this.updateTableDimensions();
        }
    }

    render() {
        return <HotTable
            data={this.state.data}
            colHeaders={true}
            rowHeaders={true}
            licenseKey="non-commercial-and-evaluation"
            ref={h => this.handsontable = h}
        />
    }
}

import React from "react";
import { Monocle } from "../../monocles/Monocle";
import { UserInterface, UserInterfaceInput, UserInterfaceOutput } from "../UserInterface";
import { UserInterfaceProvider } from "../UserInterfaceProvider";
import { TableComponent } from "./TableComponent";
import { deriveTableSettingsFrom, TableSettings } from "./TableSettings";

export type TableCellData = string | number;
export type TableData = TableCellData[][];

export interface Input extends UserInterfaceInput {
    data?: TableData;
    rowHeaders?: string[];
    columnHeaders?: string[];
};

export interface Output extends UserInterfaceOutput {

};

export class Table extends UserInterface<Input, Output> {
    readonly className = "table";

    private data: TableData;
    private component: TableComponent | null;
    private settings: TableSettings;

    constructor(monocle: Monocle, settings: TableSettings) {
        super(monocle);

        this.data = [];
        this.component = null;
        this.settings = settings;
    }

    createViewContent(): JSX.Element {
        return <TableComponent
            data={this.data}
            ref={component => this.component = component}
        />;
    }

    updateViewContent(): void {
        if (!this.component) {
            return;
        }

        this.component.setTableData(this.data);
    }

    protected get modelOutput(): Output {
        return {};
    }

    updateModel(input: Input): void {
        // TODO: check input
        if (input.data) {
            this.data = input.data;
            console.log("set input data table", input.data)
        }

        this.updateViewContent();
    }

    static makeProvider(settings: Partial<TableSettings> = {}): UserInterfaceProvider {
        return {
            provideForMonocle: (monocle: Monocle): UserInterface<Input, Output> => {
                return new Table(
                    monocle,
                    deriveTableSettingsFrom(settings)
                );
            }
        };
    }
}

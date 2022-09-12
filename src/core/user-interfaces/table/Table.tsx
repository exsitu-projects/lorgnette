import React from "react";
import { ensureArrayHasLength } from "../../../utilities/array";
import { Monocle } from "../../monocles/Monocle";
import { UserInterface, UserInterfaceInput, UserInterfaceOutput } from "../UserInterface";
import { UserInterfaceProvider } from "../UserInterfaceProvider";
import { TableComponent } from "./TableComponent";
import { deriveTableSettingsFrom, TableSettings } from "./TableSettings";

export type CellCoordinates = { row: number, column: number };
export type CellData = string | number | null;

export type TableContent = CellData[][]; // cells by row

export const EMPTY_TABLE_HEADER = Symbol("Empty table header");
export type TableHeader = string[] | typeof EMPTY_TABLE_HEADER;

export type CellChange = {
    origin: string;
    coordinates: CellCoordinates;
    oldData: CellData;
    newData: CellData;
};

export interface Input extends UserInterfaceInput {
    content?: TableContent;
    selection?: CellCoordinates[];
    rowHeader?: TableHeader;
    columnHeader?: TableHeader;
};

export interface Output extends UserInterfaceOutput {
    content: TableContent;
    selection: CellCoordinates[];
    cellChanges: CellChange[] | null;
};

export class Table extends UserInterface<Input, Output> {
    readonly className = "table";

    private content: TableContent;
    private selection: CellCoordinates[];
    private rowHeader: TableHeader;
    private columnHeader: TableHeader;

    private lastCellChanges: CellChange[] | null;

    private component: TableComponent | null;
    private settings: TableSettings;

    constructor(monocle: Monocle, settings: TableSettings) {
        super(monocle);

        this.content = [];
        this.selection = [];
        this.rowHeader = EMPTY_TABLE_HEADER;
        this.columnHeader = EMPTY_TABLE_HEADER;

        this.lastCellChanges = null;

        this.component = null;
        this.settings = settings;
    }

    private get nbRows(): number {
        return this.content.length;
    }

    private get nbColumns(): number {
        return Math.max(
            0,
            ...this.content.map(row => row.length)
        );
    }

    private get rowNames(): string[] {
        const nbRows = this.nbRows;
        return this.rowHeader === EMPTY_TABLE_HEADER
            ? new Array(nbRows).fill("")
            : ensureArrayHasLength(this.rowHeader, nbRows, "");
    }

    private get columnNames(): string[] {
        const nbColumns = this.nbColumns;
        return this.columnHeader === EMPTY_TABLE_HEADER
            ? new Array(nbColumns).fill("")
            : ensureArrayHasLength(this.columnHeader, nbColumns, "");
    }

    private onContentChange(newContent: TableContent, changes: CellChange[]): void {
        this.content = newContent;
        this.lastCellChanges = changes;
        this.declareModelChange();
    }

    private onSelectionChange(newSelection: CellCoordinates[]): void {
        this.selection = newSelection;
        this.lastCellChanges = null;
        this.declareModelChange();
    }

    createViewContent(): JSX.Element {
        return <TableComponent
            content={this.content}
            rowNames={this.rowNames}
            columnNames={this.columnNames}
            settings={this.settings}
            onContentChange={(newContent, changes) => this.onContentChange(newContent, changes)}
            onSelectionChange={(newSelection) => this.onSelectionChange(newSelection)}
            ref={component => this.component = component}
        />;
    }

    updateViewContent(): void {
        if (!this.component) {
            return;
        }

        this.component.setState({
            content: this.content,
            rowNames: this.rowNames,
            columnNames: this.columnNames
        });
    }

    protected get modelOutput(): Output {
        return {
            content: this.content,
            selection: this.selection,
            cellChanges: this.lastCellChanges
        };
    }

    updateModel(input: Input): void {
        // TODO: check input
        if (input.content) {
            this.content = input.content;
        }

        if (input.selection) {
            this.selection = input.selection;
        }

        if (input.rowHeader) {
            this.rowHeader = input.rowHeader;
        }

        if (input.columnHeader) {
            this.columnHeader = input.columnHeader;
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

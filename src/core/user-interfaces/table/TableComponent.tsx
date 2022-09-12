import React, { Component } from "react";
import { HotTable, HotTableProps } from "@handsontable/react";
import "handsontable/dist/handsontable.full.css";
import "./table.css";
import { registerAllModules } from 'handsontable/registry';
import { CellChange, CellCoordinates, TableContent } from "./Table";
import { ArrayMap } from "../../../utilities/ArrayMap";
import { TableSettings } from "./TableSettings";
import { moveElementsByIndex } from "../../../utilities/array";

// register Handsontable's modules
registerAllModules();

type Props = {
    content: TableContent;
    selection?: CellCoordinates[];
    rowNames?: string[];
    columnNames?: string[];
    settings: TableSettings,

    onContentChange?: (newContent: TableContent, changes: CellChange[]) => void;
    onSelectionChange?: (newSelection: CellCoordinates[]) => void;
};

type State = {
    content: TableContent;
    selection: CellCoordinates[];
    rowNames: string[] | boolean;
    columnNames: string[] | boolean;
};

export class TableComponent extends Component<Props, State> {
    private handsontable: HotTable | null;

    constructor(props: Props) {
        super(props);

        this.handsontable = null;
        this.state = {
            content: props.content,
            selection: props.selection ?? [],
            rowNames: props.rowNames ?? false,
            columnNames: props.columnNames ?? false
        };
    }

    setTableData(content: TableContent): void {
        this.setState({
            content: content
        });
    }

    private updateHansontableDimensions(): void {
        this.handsontable?.hotInstance?.refreshDimensions();
    }

    private updateHansontableSelection(): void {
        this.handsontable?.hotInstance?.selectCells(
            this.state.selection.map(coordinates => [
                coordinates.row,
                coordinates.column,
                coordinates.row,
                coordinates.column
            ])
        );
    }

    componentDidMount(): void {
        this.updateHansontableSelection();
        this.updateHansontableDimensions();
    }

    componentDidUpdate(previousProps: Readonly<Props>, previousState: Readonly<State>): void {
        if (previousState.content !== this.state.content
        || previousState.rowNames !== this.state.rowNames
        || previousState.columnNames !== this.state.columnNames) {
            this.updateHansontableDimensions();
        }
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
        console.error("Error caught in TableComponent:", error);
    }

    private get selectionChangeProps(): HotTableProps {
        const props: HotTableProps = {};

        const selectionChangeHandler = this.props.onSelectionChange;
        if (selectionChangeHandler) {
            props["afterSelection"] = (startRow, startColumn, endRow, endColumn) => {
                const selectedRanges = this.handsontable?.hotInstance?.getSelected();

                // If there is no selected range, the handler can be immediately invoked.
                if (!selectedRanges) {
                    selectionChangeHandler([]);
                    return;
                }

                // Otherwise, a list of all the selected cells must be created.
                // Note: Handsontable allows selected ranges to overlap, so we must ensure
                // each cell appears at most once in the list of selected cells!
                const selectedCellCoordinatesPerRowAndColumn = new ArrayMap<number, number>();
                for (let [startRow, startColumn, endRow, endColumn] of selectedRanges) {
                    const topmostRow = Math.min(startRow, endRow);
                    const bottommostRow = Math.max(startRow, endRow);
                    const leftmostColumn = Math.min(startColumn, endColumn);
                    const rightmostColumn = Math.max(startColumn, endColumn);

                    for (let row = topmostRow; row <= bottommostRow; row++) {
                        const currentValuesInRow = selectedCellCoordinatesPerRowAndColumn.getValuesOf(row);
                        for (let column = leftmostColumn; column <= rightmostColumn; column++) {
                            if (!currentValuesInRow.includes(column)) {
                                selectedCellCoordinatesPerRowAndColumn.add(row, column);
                            }
                        }
                    }
                }

                const coordinates: CellCoordinates[] = [];
                for (let [row, columns] of selectedCellCoordinatesPerRowAndColumn.entries) {
                    coordinates.push(...columns.map(column => {
                        return { row: row, column: column };
                    }));
                }

                selectionChangeHandler(coordinates);
            }
        }

        return props;
    }

    private get contentChangeProps(): HotTableProps {
        const props: HotTableProps = {};

        const contentChangeHandler = this.props.onContentChange;
        if (contentChangeHandler) {
            props["afterChange"] = (changes, source) => {
                if (!changes) {
                    return;
                }

                const newContent = this.handsontable?.hotInstance?.getSourceData();
                contentChangeHandler(
                    newContent as TableContent,
                    changes.map(change => {
                        return {
                            origin: source,
                            coordinates: {
                                row: change[0],
                                column: change[1] as number
                            },
                            oldData: change[2],
                            newData: change[3]
                        };
                    })
                );
            }
        }

        return props;
    }

    private get rowAndColumnInsertionAndDeletionProps(): HotTableProps {
        const props: HotTableProps = {};

        const contentChangeHandler = this.props.onContentChange;
        const rowSettings = this.props.settings.rows;
        const columnSettings = this.props.settings.columns;

        const rowsCanBeInsertedOrDeleted = rowSettings.canBeInserted || rowSettings.canBeDeleted;
        const columnsCanBeInsertedOrDeleted = columnSettings.canBeInserted || columnSettings.canBeDeleted;

        if (rowsCanBeInsertedOrDeleted || columnsCanBeInsertedOrDeleted) {
            props["contextMenu"] = [
                ...(rowSettings.canBeInserted ? ["row_above" as const, "row_below" as const] : []),
                ...(rowSettings.canBeDeleted ? ["remove_row" as const] : []),
                ...(rowsCanBeInsertedOrDeleted && columnsCanBeInsertedOrDeleted ? ["---------" as const] : []),
                ...(columnSettings.canBeInserted ? ["col_left" as const, "col_right" as const] : []),
                ...(columnSettings.canBeDeleted ? ["remove_col" as const] : [])
            ];
        }

        if (rowsCanBeInsertedOrDeleted && contentChangeHandler) {
            props["afterCreateRow"] = (index, amount) => {
                const newContent = this.handsontable?.hotInstance?.getSourceData();
                contentChangeHandler(newContent as TableContent, []);
            };

            props["afterRemoveRow"] = (index, amount) => {
                const newContent = this.handsontable?.hotInstance?.getSourceData();
                contentChangeHandler(newContent as TableContent, []);
            };
        }

        if (columnsCanBeInsertedOrDeleted && contentChangeHandler) {
            props["afterCreateCol"] = (index, amount) => {
                const newContent = this.handsontable?.hotInstance?.getSourceData();
                contentChangeHandler(newContent as TableContent, []);
            };

            props["afterRemoveCol"] = (index, amount) => {
                const newContent = this.handsontable?.hotInstance?.getSourceData();
                contentChangeHandler(newContent as TableContent, []);
            };
        }

        return props;
    }

    private get rowAndColumnReorderingProps(): HotTableProps {
        const props: HotTableProps = {};

        const contentChangeHandler = this.props.onContentChange;
        const rowSettings = this.props.settings.rows;
        const columnSettings = this.props.settings.columns;

        if (rowSettings.canBeMoved) {
            props["manualRowMove"] = true;

            if (contentChangeHandler) {
                props["afterRowMove"] = (movedRowIndices, finalIndex, dropIndex, movePossible, orderChanged) => {
                    if (movePossible) {
                        // Since Handsontable does not modify the order of the rows of the underlying data,
                        // we must reorder them ourselves.
                        const content = this.state.content;
                        const insertionIndex = dropIndex!;
                        const newContent = moveElementsByIndex(content, movedRowIndices, insertionIndex);
                        contentChangeHandler(newContent, []);
                    }
                }
            }
        }

        if (columnSettings.canBeMoved) {
            props["manualColumnMove"] = true;

            if (contentChangeHandler) {
                props["afterColumnMove"] = (movedColumnIndices, finalIndex, dropIndex, movePossible, orderChanged) => {
                    if (movePossible) {
                        // Since Handsontable does not modify the order of the columns of the underlying data,
                        // we must reorder them ourselves.
                        const content = this.state.content;
                        const insertionIndex = dropIndex!;
                        const newContent = content.map(row => moveElementsByIndex(row, movedColumnIndices, insertionIndex));
                        contentChangeHandler(newContent as TableContent, []);
                    }
                }
            }
        }

        return props;
    }

    render() {
        return <HotTable
            data={this.state.content}
            colHeaders={this.state.columnNames}
            rowHeaders={this.state.rowNames}
            {...this.selectionChangeProps}
            {...this.contentChangeProps}
            {...this.rowAndColumnInsertionAndDeletionProps}
            {...this.rowAndColumnReorderingProps}
            licenseKey="non-commercial-and-evaluation"
            ref={h => this.handsontable = h}
        />
    }
}

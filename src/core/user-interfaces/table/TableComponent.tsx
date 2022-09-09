import React, { Component } from "react";
import { HotTable, HotTableProps } from "@handsontable/react";
import { registerAllModules } from 'handsontable/registry';
import { CellChange, CellCoordinates, TableContent } from "./Table";
import "handsontable/dist/handsontable.full.css";
import "./table.css";
import { ArrayMap } from "../../../utilities/ArrayMap";

// register Handsontable's modules
registerAllModules();

type Props = {
    content: TableContent;
    selection?: CellCoordinates[];
    rowNames?: string[];
    columnNames?: string[];

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

    private get handsontableEventHandlerProps(): HotTableProps {
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

    render() {
        return <HotTable
            data={this.state.content}
            colHeaders={this.state.columnNames}
            rowHeaders={this.state.rowNames}
            {...this.handsontableEventHandlerProps}
            licenseKey="non-commercial-and-evaluation"
            ref={h => this.handsontable = h}
        />
    }
}

import "./value-history.css";
import React from "react";
import { CartesianGrid, XAxis, YAxis, Tooltip, LineChart, Line } from "recharts";
import { StringDiff } from "react-string-diff";
import { TimestampedValue, Value } from "./ValueHistory";
import { round } from "../../../utilities/math";

type TimestampedValueDifference<V extends Value = Value> = {
    oldValue: V;
    newValue: V;
    timestamp: number;
};

type AxisDomain = [number, number];

export const UNLIMITED_NB_VALUES = 0;

type Props = {
    maximumNbValues?: number | typeof UNLIMITED_NB_VALUES;
    initialTimestampedValue?: TimestampedValue;
};

type State = {
    valueChanges: TimestampedValue[];
};

export class ValueHistoryComponent extends React.Component<Props, State> {
    private maximumNbValues: number | typeof UNLIMITED_NB_VALUES;
    private valuesAreNumericOnly: boolean;
    private lowestNumericValue: number;
    private highestNumericValue: number;
    private areaChartYDomain: AxisDomain;

    constructor(props: Props) {
        super(props);

        this.maximumNbValues = this.props.maximumNbValues ?? UNLIMITED_NB_VALUES;
        this.valuesAreNumericOnly = true;
        this.lowestNumericValue = Infinity;
        this.highestNumericValue = -Infinity;
        this.areaChartYDomain = [0, 10];

        this.state = {
            valueChanges: this.props.initialTimestampedValue !== undefined
                ? [this.props.initialTimestampedValue]
                : []
        };
    }

    private get nbValues(): number {
        return this.state.valueChanges.length;
    }

    private get historyIsFull(): boolean {
        return this.maximumNbValues !== UNLIMITED_NB_VALUES
            && this.nbValues === this.maximumNbValues;
    }

    private get historyIsEmpty(): boolean {
        return this.nbValues === 0;
    }

    private areaChartYDomainFitsValue(value: number): boolean {
        return value < this.areaChartYDomain[1];
    }

    private computeAreaChartYDomain(): AxisDomain {
        return [
            this.lowestNumericValue - (this.lowestNumericValue / 4),
            this.highestNumericValue - (this.highestNumericValue / 4),
            // 10**(Math.ceil(Math.log10(this.maximumNumericValue)))
        ];
    }

    addValueChange(valueChange: TimestampedValue): void {
        const newValueChanges = this.historyIsFull
            ? [...this.state.valueChanges.slice(1), valueChange]
            : [...this.state.valueChanges, valueChange];

        this.setState({ valueChanges: newValueChanges });

        // If all the existing values are numeric AND the new value is numeric,
        // the maximum numeric value and the domain of the chart's Y axis may have to be updated.
        if (this.valuesAreNumericOnly && typeof valueChange.value === "number") {
            const numericValues = newValueChanges.map(change => change.value as number);
            this.highestNumericValue = Math.max(...numericValues);
            this.lowestNumericValue = Math.min(...numericValues);

            if (!this.areaChartYDomainFitsValue(valueChange.value)) {
                this.areaChartYDomain = this.computeAreaChartYDomain();
            }
        }
        // Otherwise, the history must be marked as non-numeric only.
        else {
            this.valuesAreNumericOnly = false;
        }
    }

    private getDatedValuesForChartHistory(): { timestamp: number, time: string, value: number }[] {
        const maxValueNbDecimals = 5;

        return this.state.valueChanges.map(change => {
            const date = new Date(change.timestamp);
            return {
                timestamp: change.timestamp,
                time: `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`,
                value: round(change.value as number, maxValueNbDecimals)
            };
        });
    }

    private renderChartHistory(): React.ReactElement {
        return <LineChart
            width={400}
            height={250}
            data={this.getDatedValuesForChartHistory()}
            margin={{ top: 10, right: 10, left: 10, bottom: 10 }}
            className="number-chart"
        >
            <XAxis dataKey="time" />
            <YAxis domain={this.areaChartYDomain} />
            <CartesianGrid stroke="#f5f5f5" />
            <Line
                type="stepAfter"
                dataKey="value"
                dot={true}
                animationDuration={100}
                animationEasing="ease-in-out"
            />
            <Tooltip />
        </LineChart>;
    }

    private renderStringDiffHistory(): React.ReactElement {
        const nbValueChanges = this.state.valueChanges.length;
        const valueDifferences: TimestampedValueDifference[] = [];

        if (nbValueChanges > 0) {
            const initialChange = this.state.valueChanges[0];
            let lastValue = initialChange.value;

            valueDifferences.push({
                timestamp: initialChange.timestamp,
                oldValue: lastValue,
                newValue: lastValue
            });

            for (let i = 1; i < nbValueChanges; i++) {
                const currentChange = this.state.valueChanges[i];
                valueDifferences.push({
                    timestamp: currentChange.timestamp,
                    oldValue: lastValue,
                    newValue: currentChange.value
                });

                lastValue = currentChange.value;
            }
        }

        const renderValueDifference = (valueDifference: TimestampedValueDifference) => {
            const changeDate = new Date(valueDifference.timestamp);
            const minutesAsString = changeDate.getMinutes().toString().padStart(2, "0");
            const secondsAsString = changeDate.getSeconds().toString().padStart(2, "0");
            const timestampAsString = `${minutesAsString}:${secondsAsString}`;

            return <li key={valueDifference.timestamp}>
                <span className="time">{timestampAsString}</span>
                <div className="difference">
                    <StringDiff
                        oldValue={valueDifference.oldValue.toString()}
                        newValue={valueDifference.newValue.toString()}
                    />
                </div>
            </li>;
        };

        return <ul className="string-differences">
            {valueDifferences.map(valueDifference => renderValueDifference(valueDifference))}
        </ul>;
    }

    render() {
        return this.historyIsEmpty
            ? <span className="empty-history-notice">(No value change has been recorded yet.)</span>
            : this.valuesAreNumericOnly
                ? this.renderChartHistory()
                : this.renderStringDiffHistory();
    }
}
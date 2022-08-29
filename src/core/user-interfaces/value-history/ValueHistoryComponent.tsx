import React, { Component } from "react";
import { CartesianGrid, XAxis, YAxis, AreaChart, Area } from "recharts";
import { StringDiff } from "react-string-diff";
import { TimestampedValue, Value } from "./ValueHistory";
import "./value-history.css";

type TimestampedValueDifference<V extends Value = Value> = {
    oldValue: V;
    newValue: V;
    timestamp: number;
};

type AxisDomain = [number, number];

type Props = {
    initialTimestampedValue?: TimestampedValue;
};

type State = {
    valueChanges: TimestampedValue[];
};

export class ValueHistoryComponent extends Component<Props, State> {
    private valuesAreNumericOnly: boolean;
    private maximumNumericValue: number;
    private areaChartYDomain: AxisDomain;

    constructor(props: Props) {
        super(props);

        this.valuesAreNumericOnly = true;
        this.maximumNumericValue = -Infinity;
        this.areaChartYDomain = [0, 10];

        this.state = {
            valueChanges: this.props.initialTimestampedValue !== undefined
                ? [this.props.initialTimestampedValue]
                : []
        };
    }

    private get isEmptyHistory(): boolean {
        return this.state.valueChanges.length === 0;
    }
    
    private areaChartYDomainFitsValue(value: number): boolean {
        return value < this.areaChartYDomain[1];
    }

    private computeAreaChartYDomain(): AxisDomain {
        return [
            0,
            // 10**(Math.ceil(Math.log10(this.maximumNumericValue))),
            this.maximumNumericValue * 2,
        ];
    }

    addValueChange(valueChange: TimestampedValue): void {
        this.setState({
            valueChanges: [...this.state.valueChanges, valueChange]
        });

        // If the new value is numeric, the maximum numeric value
        // and the domain of the chart's Y axis may have to be updated.
        // Otherwise, the history must be marked as non-numeric only.
        if (typeof valueChange.value === "number") {
            const numericValue = valueChange.value;
            if (numericValue > this.maximumNumericValue) {
                this.maximumNumericValue = numericValue;
                
                if (!this.areaChartYDomainFitsValue(numericValue)) {
                    this.areaChartYDomain = this.computeAreaChartYDomain();
                }
            }
        }
        else {
            this.valuesAreNumericOnly = false;
        }
    }

    private renderAreaChartHistory(): React.ReactElement {
        return <AreaChart
            width={400}
            height={250}
            data={this.state.valueChanges}
            margin={{ top: 10, right: 10, left: 10, bottom: 10 }}
            className="number-differences"
        >
            <XAxis dataKey="name" />
            <YAxis domain={this.areaChartYDomain} />
            <CartesianGrid stroke="#f5f5f5" />
            <Area
                type="stepAfter"
                dataKey="value"
                dot={true}
                animationDuration={100}
                animationEasing="ease-in-out"
            />
        </AreaChart>;
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
        }

        return <ul className="string-differences">
            {valueDifferences.map(valueDifference => renderValueDifference(valueDifference))}
        </ul>;
    }

    render() {
        return this.isEmptyHistory
            ? <span className="empty-history-notice">(No value change has been recorded yet.)</span>
            : this.valuesAreNumericOnly
                ? this.renderAreaChartHistory()
                : this.renderStringDiffHistory();
    }
}
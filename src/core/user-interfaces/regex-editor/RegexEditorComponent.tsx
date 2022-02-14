import React, { ReactElement } from "react";
import "./regex-editor.css";
import { InputGroup, Label } from "@blueprintjs/core";
import { Range } from "../../documents/Range";
import { LargeRegexDiagramComponent } from "./LargeRegexDiagramComponent";
import { SplitRegex } from "../../../utilities/SplitRegex";

type Props = {
    regex: RegExp;
    regexRange: Range | null;
    onChange?: (regexBody: string, regexFlags: string) => void;
};

export class RegexEditorComponent extends React.Component<Props> {
    private createEditor(): ReactElement {
        const splitRegex = SplitRegex.fromRegex(this.props.regex);

        return <div className="regex-editor">
            <Label className="regex-body">
                Regular expression (without <span style={{fontFamily: "monospace"}}>/</span> delimiters)
                <InputGroup
                    defaultValue={splitRegex.body}
                    onChange={event => this.props.onChange && this.props.onChange(
                        event.target.value,
                        splitRegex.flags
                    )}
                    large={true}
                />
            </Label>
            <Label className="regex-flags">
                Flags
                <InputGroup
                    defaultValue={splitRegex.flags}
                    onChange={event => this.props.onChange && this.props.onChange(
                        splitRegex.body,
                        event.target.value
                    )}
                    large={true}
                />
            </Label>
        </div>;
    }

    render() {
        return <>
            {this.createEditor()}
            <LargeRegexDiagramComponent
                regex={this.props.regex}
                regexRange={this.props.regexRange}
            />
        </>;
    }
}

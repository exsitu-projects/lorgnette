import React from "react";
import { Label, EditableText } from "@blueprintjs/core";
import { RegexMatcher } from "../../utilities/RegexMatcher";

type Props = {
    label: string,
    regexMatcher: RegexMatcher,
    onPatternChange?: () => void
}

export class RegexPatternEditor extends React.Component<Props> {
    render() {
        const onPatternChange = this.props.onPatternChange ?? (() => {});

        return (
            <Label className="regex-pattern-editor">
                {this.props.label}
                <div className="pattern-and-context">
                    <span className="context prefix">/</span>
                    <EditableText
                        className="pattern"
                        value={this.props.regexMatcher.pattern}
                        onChange={newPattern => {
                            this.props.regexMatcher.pattern = newPattern;
                            onPatternChange();
                        }} 
                    />
                    <span className="context suffix">/{this.props.regexMatcher.flags}</span>
                </div>
            </Label>
        );
    }
}
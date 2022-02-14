import React, { ReactElement } from "react";
import "./regex-editor.css";
import { Overlay } from "@blueprintjs/core";
import { Range } from "../../documents/Range";
import { SmallRegexDiagramComponent } from "./SmallRegexDiagramComponent";
import { SplitRegex } from "../../../utilities/SplitRegex";
import { RegexEditorComponent } from "./RegexEditorComponent";

type Props = {
    regex: RegExp;
    regexRange: Range | null;
    onChange?: (regexBody: string, regexFlags: string) => void;
};

type State = {
    isPopupOpen: boolean;
};

export class RegexEditorPopupComponent extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            isPopupOpen: false
        };
    }

    private createThumbnail(): ReactElement {
        return <div className="regex-popup-thumbnail">
            <SmallRegexDiagramComponent
                regex={this.props.regex}
                regexRange={this.props.regexRange}
                onClick={() => this.setState({ isPopupOpen: !this.state.isPopupOpen })}
            />
        </div>;
    }

    private createOverlay(): ReactElement {
        const splitRegex = SplitRegex.fromRegex(this.props.regex);

        return <Overlay isOpen={this.state.isPopupOpen}>
            <div
                className="regex-popup-content-wrapper"
                onClick={() => { this.setState({ isPopupOpen: false }); }}
            >
                <div
                    className="regex-popup-content-panel"
                    onClick={event => event.stopPropagation()}
                >
                    <RegexEditorComponent
                        regex={this.props.regex}
                        regexRange={this.props.regexRange}
                        onChange={this.props.onChange && this.props.onChange}
                    />
                </div>
            </div>
        </Overlay>;
    }

    render() {
        return <>
            {this.createThumbnail()}
            {this.createOverlay()}
        </>;
    }
}

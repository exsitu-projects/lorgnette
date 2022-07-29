import React, { ReactElement } from "react";
import "./regex-editor.css";
import { RegulexIframe } from "./RegulexIframe";
import { SplitRegex } from "../../../utilities/SplitRegex";
import { Range } from "../../documents/Range";
import { MonocleEnvironmentContext } from "../../../MonocleEnvironment";

type Props = {
    regex: RegExp;
    regexRange: Range | null;
    onClick?: () => void;
};

export class SmallRegexDiagramComponent extends React.PureComponent<Props> {
    private createSmallRegulexIframe(splitRegex: SplitRegex): ReactElement {
        const regexBody = splitRegex.body;
        const regexFlags = splitRegex.flags;

        const panelWidth = window.innerWidth * 0.3;
        const overlayWidth = window.innerWidth * 0.8;
        const nbCharacterSetsInRegexBody = (regexBody.match((/[^\\]\[/g)) || []).length;

        const iframeWidth = (regexBody.length * 40) / (1 + nbCharacterSetsInRegexBody / 5); // px
        const iframeHeight = (regexBody.length * 200) / 45; // px
        const iframeScale = panelWidth / iframeWidth;
        const iframeMarginBottom = -(iframeHeight * (1 - iframeScale)); // px (to remove useless whitespace)

        return <RegulexIframe
            splitRegex={splitRegex}
            htmlAttributes={{
                style: `
                    width: ${iframeWidth}px;
                    height: ${iframeHeight}px;
                    transform: scale(${iframeScale});
                    margin-bottom: ${iframeMarginBottom}px;
                `,
            }}
        />;
    }

    render() {
        const splitRegex = SplitRegex.fromRegex(this.props.regex);
        const iframe = this.createSmallRegulexIframe(splitRegex);

        return <MonocleEnvironmentContext.Consumer>{ environment => (
            <>    
                <div className="regex-diagram small">
                    {iframe}
                </div>
                <div
                    className="regex-diagram-overlay"
                    onClick={() => this.props.onClick && this.props.onClick()}
                    onMouseEnter={() => {
                        console.log(this.props.regexRange)
                        if (this.props.regexRange) {
                            environment.updateCodeEditorRanges({ hovered: [this.props.regexRange] })
                        }
                    }}
                    onMouseLeave={() => {
                        if (this.props.regexRange) {
                            environment.updateCodeEditorRanges({ hovered: [] })
                        }
                    }}
                />
            </>
        )}</MonocleEnvironmentContext.Consumer>;
    }
}

import React, { ReactElement } from "react";
import "./regex-editor.css";
import { Range } from "../../../core/documents/Range";
import { RegulexIframe } from "./RegulexIframe";
import { SplitRegex } from "../../../utilities/SplitRegex";

type Props = {
    regex: RegExp;
    regexRange: Range | null;
};

export class LargeRegexDiagramComponent extends React.PureComponent<Props> {
    private createLargeRegulexIframe(splitRegex: SplitRegex): ReactElement {
        const regexBody = splitRegex.body;
        const regexFlags = splitRegex.flags;

        const panelWidth = window.innerWidth * 0.3;
        const overlayWidth = window.innerWidth * 0.8;
        const nbCharacterSetsInRegexBody = (regexBody.match((/[^\\]\[/g)) || []).length;

        const iframeWidth = (regexBody.length * 50) / (1 + nbCharacterSetsInRegexBody / 5); // px
        const iframeHeight = (regexBody.length * 200) / 40; // px
        const iframeScale = overlayWidth / iframeWidth;
        const iframeMarginBottom = -(iframeHeight * (1 - iframeScale) / 4); // px (to remove useless whitespace)

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
        const iframe = this.createLargeRegulexIframe(splitRegex);

        return <div className="regex-diagram large">
            {iframe}
        </div>;
    }
}

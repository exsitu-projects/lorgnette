
import React from "react";
import { SplitRegex } from "../../../utilities/SplitRegex";

type Props = {
    splitRegex: SplitRegex;
    htmlAttributes: Record<string, string>;
};

export class RegulexIframe extends React.PureComponent<Props> {
    private iframeContainerRef: React.RefObject<HTMLDivElement>;

    constructor(props: Props) {
        super(props);
        this.iframeContainerRef = React.createRef();
    }

    private get url(): string {
        const encodedRegexBody = encodeURIComponent(this.props.splitRegex.body);
        const encodedRegexFlags = encodeURIComponent(this.props.splitRegex.flags);

        return `https://jex.im/regulex/#!embed=true&flags=${encodedRegexFlags}&re=${encodedRegexBody}`;
    }

    private dynamicallyCreateIframe(): void {
        const containerNode = this.iframeContainerRef.current;
        const htmlAttributesAsText = Object.entries(this.props.htmlAttributes)
            .map(([key, value]) => `${key}="${value.replace("\"", "\\\"")}"`)
            .join("\n");

        if (containerNode) {
            containerNode.innerHTML = `
                <iframe
                    src="${this.url}"
                    sandbox="allow-scripts"
                    ${htmlAttributesAsText}
                ></iframe>
            `;
        }
    }

    componentDidUpdate(previousProps: Props) {
        if (previousProps.splitRegex.isEqualTo(this.props.splitRegex)) {
            return;
        }

        const containerNode = this.iframeContainerRef.current;
        if (!containerNode) {
            console.warn("The iframe cannot be (re)created: the ref. to the container does not exist.", containerNode);
            return;
        }

        this.dynamicallyCreateIframe();
    }

    componentDidMount() {
        const containerNode = this.iframeContainerRef.current;
        if (!containerNode) {
            console.warn("The iframe cannot be (re)created: the ref. to the container does not exist.", containerNode);
            return;
        }

        this.dynamicallyCreateIframe();
    }

    render() {
        return <div
            ref={this.iframeContainerRef}
            className="iframe-container"
        />;
    }
}
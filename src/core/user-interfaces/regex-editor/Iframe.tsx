import React from "react";

type Props = {
    src: string;
    htmlAttributes: Record<string, string>;
};

export class Iframe extends React.PureComponent<Props> {
    private iframeContainerRef: React.RefObject<HTMLDivElement>;

    constructor(props: Props) {
        super(props);
        this.iframeContainerRef = React.createRef();
    }

    private dynamicallyCreateIframe(): void {
        const containerNode = this.iframeContainerRef.current;
        console.log(this.props.src)

        const htmlAttributesAsText = Object.entries(this.props.htmlAttributes)
            .map(([key, value]) => `${key}="${value.replace("\"", "\\\"")}"`)
            .join("\n");

        if (containerNode) {
            containerNode.innerHTML = `
                <iframe
                    src="${this.props.src}"
                    sandbox="allow-scripts"
                    ${htmlAttributesAsText}
                ></iframe>
            `;
        }
    }

    componentDidUpdate(previousProps: Props) {
        if (previousProps.src === this.props.src) {
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
import { InputGroup, Label, Overlay } from "@blueprintjs/core";
import React, { ReactElement } from "react";
import { Debouncer } from "../../../utilities/Debouncer";
import "./regex-editor.css";


type Props = {
    regex: RegExp;
    onChange?: (regexBody: string, regexFlags: string) => void;
};

type State = {
    isOverlayOpen: boolean;
};

export class RegexEditorComponent extends React.Component<Props, State> {
    private static readonly iframeUpdateDebouncerMinDelay: number = 1000; // ms

    private readonly iframeUpdateDebouncer: Debouncer;

    private readonly thumbnailIframeRef: React.RefObject<HTMLIFrameElement>;
    private readonly enlargedIframeRef: React.RefObject<HTMLIFrameElement>;

    constructor(props: Props) {
        super(props);

        this.iframeUpdateDebouncer = new Debouncer(
            () => { console.info(">>> RUN TASK!"); this.updateIframes() },
            RegexEditorComponent.iframeUpdateDebouncerMinDelay
        );

        this.thumbnailIframeRef = React.createRef();
        this.enlargedIframeRef = React.createRef();

        this.state = {
            // regexBody: RegexEditorComponent.getRegexBody(props.regex),
            // regexFlags: RegexEditorComponent.getRegexFlags(props.regex),
            isOverlayOpen: false
        };
    }

    componentDidUpdate(previousProps: Props) {
        if (previousProps.regex === this.props.regex) {
            return
        }

        this.iframeUpdateDebouncer.runOrScheduleTask();
    }

    componentWillUnmount() {
        this.iframeUpdateDebouncer.cancelScheduledTask();
    }

    render() {
        // Split the body and the flags of the regex.
        const regexBody = RegexEditorComponent.getRegexBody(this.props.regex);
        const regexFlags = RegexEditorComponent.getRegexFlags(this.props.regex);

        // Compute some values for styling each iframe.
        const panelWidth = window.innerWidth * 0.3;
        const overlayWidth = window.innerWidth * 0.8;
        const nbCharacterSetsInRegexBody = (regexBody.match((/[^\\]\[/g)) || []).length;

        // Create the two iframes (the thumbnail + the enlarged version).
        const regexVisualisationIframeThumbnail = RegexEditorComponent.createVisualisationIframe(
            regexBody,
            regexFlags,
            {
                ref: this.thumbnailIframeRef,
                style: {
                    width: `${regexBody.length * 40 / (1 + nbCharacterSetsInRegexBody / 5)}px`,
                    height: `${regexBody.length * 200 / 45}px`,
                    transform: `scale(${panelWidth / (regexBody.length * 40 / (1 + nbCharacterSetsInRegexBody / 5))})`,
                },
                onClick: () => { this.setState({ isOverlayOpen: true }); }
            }
        );

        const regexVisualisationIframeEnlarged = RegexEditorComponent.createVisualisationIframe(
            regexBody,
            regexFlags,
            {
                ref: this.enlargedIframeRef,
                style: {
                    width: `${regexBody.length * 50 / (1 + nbCharacterSetsInRegexBody / 5)}px`,
                    height: `${regexBody.length * 200 / 40}px`,
                    transform: `scale(${overlayWidth / (regexBody.length * 50 / (1 + nbCharacterSetsInRegexBody / 5))})`,
                }
            }
        );

        return <div className="ui regex-editor">
            {regexBody} / {regexFlags}
            <br/>

            <div className="regex-visualisation-thumbnail">
                {regexVisualisationIframeThumbnail}
                {/* <div ref={this.thumbnailIframeRef} /> */}
                <div
                    className="iframe-overlay"
                    onClick={() => { this.setState({ isOverlayOpen: true }); }}
                />
            </div>

            <Overlay isOpen={this.state.isOverlayOpen}>
                <div
                    className="regex-visualisation-overlay-background"
                    onClick={() => { this.setState({ isOverlayOpen: false }); }}
                >
                    <div
                        className="regex-visualisation-overlay-content"
                        onClick={event => event.stopPropagation()}
                    >
                        <div className="regex-visualisation-overlay-editor">
                            <Label className="regex-content">
                                Regular expression (without <span style={{fontFamily: "monospace"}}>/</span> delimiters)
                                <InputGroup
                                    defaultValue={regexBody}
                                    onChange={event => this.props.onChange && this.props.onChange(
                                        event.target.value,
                                        RegexEditorComponent.getRegexFlags(this.props.regex)
                                    )}
                                    large={true}
                                />
                            </Label>
                        <Label className="regex-flags">
                            Flags
                            <InputGroup
                                defaultValue={regexFlags}
                                onChange={event => this.props.onChange && this.props.onChange(
                                    RegexEditorComponent.getRegexBody(this.props.regex),
                                    event.target.value,
                                )}
                                large={true}
                            />
                        </Label>
                        </div>
                        <div className="regex-visualisation-overlay-diagram">
                            {regexVisualisationIframeEnlarged}
                        </div>
                    </div>
                </div>
            </Overlay>
        </div>;
    }

    private updateIframes() {
        function forceRefreshIframe(iframe: HTMLIFrameElement): void {
            const url = iframe.src;
            iframe.src = "";
            iframe.src = url;
        }

        const thumbnailIframe = this.thumbnailIframeRef.current;
        if (thumbnailIframe) {
            forceRefreshIframe(thumbnailIframe);
            console.log("REFRESH thumbnail")
        }

        const enlargedIframe = this.enlargedIframeRef.current;
        if (this.state.isOverlayOpen && enlargedIframe) {
            forceRefreshIframe(enlargedIframe);
            console.log("REFRESH enlarged")
        }
    }

    private static getRegexBody(regex: RegExp): string {
        const regexAsString = regex.toString();
        return regexAsString.slice(1, regexAsString.length - 1);
    }

    private static getRegexFlags(regex: RegExp): string {
        return regex.flags;
    }

    private static createVisualisationIframe(
        regexBody: string,
        regexFlags: string,
        props: React.ComponentProps<"iframe">
    ): ReactElement {
        const encodedRegexBody = encodeURIComponent(regexBody);
        const encodedRegexFlags = encodeURIComponent(regexFlags);
        const url = `https://jex.im/regulex/#!embed=true&flags=${encodedRegexFlags}&re=${encodedRegexBody}`;

        // console.log("Creating a new iframe: ", url);

        return <iframe
            src={url}
            sandbox="allow-scripts"
            {...props}
        />
    }
}

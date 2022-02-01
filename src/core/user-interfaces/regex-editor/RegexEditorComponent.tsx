import { InputGroup, Label, Overlay } from "@blueprintjs/core";
import React, { ReactElement } from "react";
import { GlobalContext } from "../../../context";
import { Debouncer } from "../../../utilities/Debouncer";
import { Range } from "../../documents/Range";
import "./regex-editor.css";


type IframeElements = {
    thumbnail: ReactElement<"iframe">,
    enlarged: ReactElement<"iframe">
};

type SplitRegex = {
    body: string;
    flags: string;
};

type Props = {
    regex: RegExp;
    regexRange: Range | null;
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
            () => {
                console.info(">>> RUN TASK!");
                this.updateIframes()
            },
            RegexEditorComponent.iframeUpdateDebouncerMinDelay
        );

        this.thumbnailIframeRef = React.createRef();
        this.enlargedIframeRef = React.createRef();

        this.state = {
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

    private createIframes(splitRegex: SplitRegex): IframeElements {
        const regexBody = splitRegex.body;
        const regexFlags = splitRegex.flags;

        const panelWidth = window.innerWidth * 0.3;
        const overlayWidth = window.innerWidth * 0.8;
        const nbCharacterSetsInRegexBody = (regexBody.match((/[^\\]\[/g)) || []).length;

        const thumbnailIframeWidth = (regexBody.length * 40) / (1 + nbCharacterSetsInRegexBody / 5); // px
        const thumbnailIframeHeight = (regexBody.length * 200) / 45; // px
        const thumbnailIframeScale = panelWidth / thumbnailIframeWidth;
        const thumbnailIframeMarginBottom = -(thumbnailIframeHeight * (1 - thumbnailIframeScale)); // px (to remove useless whitespace)

        const thumbnailIframe = RegexEditorComponent.createVisualisationIframe(
            regexBody,
            regexFlags,
            {
                ref: this.thumbnailIframeRef,
                style: {
                    width: `${thumbnailIframeWidth}px`,
                    height: `${thumbnailIframeHeight}px`,
                    transform: `scale(${thumbnailIframeScale})`,
                    marginBottom: `${thumbnailIframeMarginBottom}px`
                },
                onClick: () => { this.setState({ isOverlayOpen: true }); }
            }
        );

        const enlargedIframeWidth = (regexBody.length * 50) / (1 + nbCharacterSetsInRegexBody / 5); // px
        const enlargedIframeHeight = (regexBody.length * 200) / 40; // px
        const enlargedIframeScale = overlayWidth / enlargedIframeWidth;
        const enlargedIframeMarginBottom = -(thumbnailIframeHeight * (1 - thumbnailIframeScale)); // px (to remove useless whitespace)

        const enlargedIframe = RegexEditorComponent.createVisualisationIframe(
            regexBody,
            regexFlags,
            {
                ref: this.enlargedIframeRef,
                style: {
                    width: `${enlargedIframeWidth}px`,
                    height: `${enlargedIframeHeight}px`,
                    transform: `scale(${enlargedIframeScale})`,
                    marginBottom: `${enlargedIframeMarginBottom}px`
                }
            }
        );

        return {
            thumbnail: thumbnailIframe,
            enlarged: enlargedIframe
        };
    }

    private updateIframes(): void {
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

    private createThumbnailVisualisation(
        thumbnailIframe: ReactElement<"iframe">,
        splitRegex: SplitRegex
    ): ReactElement {
        return <GlobalContext.Consumer>{ context => (
            <div className="regex-visualisation-thumbnail">
                {thumbnailIframe}
                <div
                    className="iframe-overlay"
                    onClick={() => { this.setState({ isOverlayOpen: true }); }}
                    onMouseEnter={() => {
                        console.log(this.props.regexRange)
                        if (this.props.regexRange) {
                            context.updateCodeEditorRanges({ hovered: [this.props.regexRange] })
                        }
                    }}
                    onMouseLeave={() => {
                        if (this.props.regexRange) {
                            context.updateCodeEditorRanges({ hovered: [] })
                        }
                    }}
                />
            </div>
        )}</GlobalContext.Consumer>;
    }

    private createEnlargedVisualisation(
        enlargedIframe: ReactElement<"iframe">,
        splitRegex: SplitRegex
    ): ReactElement {
        return <Overlay isOpen={this.state.isOverlayOpen}>
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
                                defaultValue={splitRegex.body}
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
                            defaultValue={splitRegex.flags}
                            onChange={event => this.props.onChange && this.props.onChange(
                                RegexEditorComponent.getRegexBody(this.props.regex),
                                event.target.value,
                            )}
                            large={true}
                        />
                    </Label>
                    </div>
                    <div className="regex-visualisation-overlay-diagram">
                        {enlargedIframe}
                    </div>
                </div>
            </div>
        </Overlay>;
    }

    render() {
        const splitRegex = RegexEditorComponent.splitRegex(this.props.regex);

        const iframes = this.createIframes(splitRegex);
        const thumbnailVisualisation = this.createThumbnailVisualisation(iframes.thumbnail, splitRegex);
        const enlargedVisualisation = this.createEnlargedVisualisation(iframes.enlarged, splitRegex);

        return <div className="ui regex-editor">
            {/* {regexBody} / {regexFlags} */}
            {thumbnailVisualisation}
            {enlargedVisualisation}
        </div>;
    }

    private static getRegexBody(regex: RegExp): string {
        const regexAsString = regex.toString();
        return regexAsString.slice(1, regexAsString.length - 1);
    }

    private static getRegexFlags(regex: RegExp): string {
        return regex.flags;
    }

    private static splitRegex(regex: RegExp): SplitRegex {
        return {
            body: RegexEditorComponent.getRegexBody(regex),
            flags: RegexEditorComponent.getRegexFlags(regex)
        };
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

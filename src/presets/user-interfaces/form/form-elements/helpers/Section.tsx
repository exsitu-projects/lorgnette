import React, { PropsWithChildren, ReactElement } from "react";

export type SectionProps = PropsWithChildren<{
    title?: string;
    style?: React.CSSProperties;
    contentStyle?: React.CSSProperties;
}>;

export class Section extends React.PureComponent<SectionProps> {
    render(): ReactElement | null {
        return <div className="form-section" style={this.props.style}>
            <div className="form-section-header">
                <div className="form-section-separator" />
                <div className="form-section-title">
                    { this.props.title }
                </div>
                <div className="form-section-separator" />
            </div>
            <div className="form-section-content" style={this.props.contentStyle}>
                { this.props.children }
            </div>
        </div>;
    }
}

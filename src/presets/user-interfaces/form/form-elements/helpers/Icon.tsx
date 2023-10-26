import React, { ReactElement } from "react";
import { Icon as BlueprintIcon, IconProps as BlueprintIconProps } from "@blueprintjs/core";

export type IconProps = {
    id: BlueprintIconProps["icon"];
};

export class Icon extends React.PureComponent<IconProps> {
    render(): ReactElement {
        return <BlueprintIcon icon={this.props.id} />;
    }
}

import "./user-interface-error.css";
import { ReactElement } from "react";

export const enum UserInterfaceErrorOrigin {
    ForwardMapping = "ForwardMapping",
    UserInterface = "UserInterface"
}

export class UserInterfaceError {
    readonly origin: UserInterfaceErrorOrigin;
    readonly title: string;
    readonly body: ReactElement | null;

    constructor(
        origin: UserInterfaceErrorOrigin,
        title: string,
        body?: ReactElement
    ) {
        this.origin = origin;
        this.title = title;
        this.body = body ?? null;
    }

    createView(): ReactElement {
        return <div
            className="ui-error"
        >
            <span className="title">{ this.title }</span>
            <div className="body">
                { this.body }
            </div>
        </div>;
    }
}

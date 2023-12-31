import React, { PropsWithChildren } from "react";
import { UserInterfaceError, UserInterfaceErrorOrigin } from "./UserInterfaceError";

type Props = PropsWithChildren<{
    initialError: UserInterfaceError | null;
}>;

interface State {
    error: UserInterfaceError | null;
}

export class UserInterfaceErrorCatcherAndDisplay extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);

        this.state = {
            error: props.initialError
        };
    }

    setError(error: UserInterfaceError | null): void {
        this.setState({ error: error });
    }

    componentDidCatch(error: Error) {
        this.setError(
            new UserInterfaceError(
                UserInterfaceErrorOrigin.UserInterface,
                "Exception thrown by the user interface",
                <div>{ error.message }</div>
            )
        );
    }

    render() {
        const errorToDisplay = this.state.error;
        return errorToDisplay
            ? errorToDisplay.createView()
            : this.props.children;
    }
}

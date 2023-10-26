import React, { ReactElement } from "react";
import { Observer } from "../../utilities/Observer";
import { FixedThrottler } from "../../utilities/tasks/FixedThrottler";
import { Projection } from "../projections/Projection";
import { UserInterfaceError } from "./error/UserInterfaceError";
import { UserInterfaceErrorCatcherAndDisplay } from "./error/UserInterfaceErrorCatcherAndDisplay";

export type UserInterfaceInput = any | UserInterfaceError;

export type UserInterfaceOutput = any;

export abstract class UserInterface<
    I extends UserInterfaceInput = UserInterfaceInput,
    O extends UserInterfaceOutput = UserInterfaceOutput
> {
    abstract readonly className: string;
    protected projection: Projection;
    protected error: UserInterfaceError | null;
    
    private modelChangeObservers: Set<Observer<O>>;
    private modelChangeNotificationThrottler: FixedThrottler;

    private errorCatcherAndDisplayRef: React.RefObject<UserInterfaceErrorCatcherAndDisplay>;

    constructor(projection: Projection) {
        this.projection = projection;
        this.error = null;

        this.modelChangeObservers = new Set();
        this.modelChangeNotificationThrottler = new FixedThrottler(
            () => this.notifyModelChangeObservers(),
            this.minDelayBetweenModelChangeNotifications
        );

        this.errorCatcherAndDisplayRef = React.createRef();
    }

    protected abstract get modelOutput(): O;
    protected abstract processInput(input: I): void;
    protected abstract createViewContent(): ReactElement;

    protected get isInTransientState(): boolean {
        return this.projection.isTransient;
    }

    protected beginTransientState(): void {
        this.projection.beginTransientState();
    }

    protected endTransientState(): void {
        this.projection.endTransientState();
    }

    protected get minDelayBetweenModelChangeNotifications(): number {
        return 200; // ms
    }
    
    addModelChangeObserver(observer: Observer<O>): void {
        this.modelChangeObservers.add(observer);
    }

    removeModelChangeObserver(observer: Observer<O>): void {
        this.modelChangeObservers.delete(observer);
    }

    private notifyModelChangeObservers(): void {
        for (let observer of this.modelChangeObservers.values()) {
            observer.processChange(this.modelOutput);
        }
    }
    
    protected declareModelChange(clearQueuedChangeDeclarations: boolean = false): void {
        if (clearQueuedChangeDeclarations) {
            this.modelChangeNotificationThrottler.throttler.clearTasks();
        }
        
        this.modelChangeNotificationThrottler.runTask();
    }

    updateInput(input: I): void {
        if (input instanceof UserInterfaceError) {
            this.error = input;
            this.errorCatcherAndDisplayRef.current?.setError(input);
            return;
        }

        this.error = null;
        this.errorCatcherAndDisplayRef.current?.setError(null);

        this.processInput(input);
    }

    createView(): ReactElement {
        return <div
            className={`ui ${this.className}`}
            data-projection-uid={this.projection.uid}
        >
            <UserInterfaceErrorCatcherAndDisplay
                ref={this.errorCatcherAndDisplayRef}
                initialError={this.error}
            >
                { this.createViewContent() }
            </UserInterfaceErrorCatcherAndDisplay>
        </div>;
    }
}
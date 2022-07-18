import React, { ReactElement } from "react";
import { Observer } from "../../utilities/Observer";
import { Throttler } from "../../utilities/Throttler";
import { Monocle } from "../visualisations/Monocle";

export type UserInterfaceInput = {};

export type UserInterfaceOutput = any;

export type PartialUserInterfaceOutput =
    Omit<UserInterfaceOutput, "data">;

export abstract class UserInterface<
    I extends UserInterfaceInput = UserInterfaceInput,
    O extends UserInterfaceOutput = UserInterfaceOutput
> {
    abstract readonly className: string;
    protected monocle: Monocle;
    
    private modelChangeObservers: Set<Observer<O>>;
    private modelChangeNotificationThrottler: Throttler;

    constructor(monocle: Monocle) {
        this.monocle = monocle;

        this.modelChangeObservers = new Set();
        this.modelChangeNotificationThrottler = new Throttler(
            () => this.notifyModelChangeObservers(),
            this.minDelayBetweenModelChangeNotifications
        )
    }

    protected abstract get modelOutput(): O;
    abstract createViewContent(): ReactElement;
    abstract updateModel(input: I): void;

    protected get isTransient(): boolean {
        return this.monocle.isTransient;
    }

    protected beginTransientState(): void {
        this.monocle.beginTransientState();
    }

    protected endTransientState(): void {
        this.monocle.endTransientState();
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
    
    protected declareModelChange(notifyImmediately: boolean = false): void {
        if (notifyImmediately) {
            this.modelChangeNotificationThrottler.cancelScheduledTask();
            this.modelChangeNotificationThrottler.runTaskImmediately();
        }
        else {
            this.modelChangeNotificationThrottler.runOrScheduleTask();
        }
    }

    createView(uiContainerProps: React.ComponentProps<"div"> = {}): ReactElement {
        return <div
            className={`ui ${this.className}`}
            data-monocle-uid={this.monocle.uid}
            {...uiContainerProps}
        >
            {this.createViewContent()}
        </div>
    }
}
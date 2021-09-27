import { Observer } from "../../utilities/Observer";
import { Throttler } from "../../utilities/Throttler";
import { CodeVisualisation } from "../visualisations/CodeVisualisation";

export interface UserInterfaceInput {}
export interface UserInterfaceOutput {
    data: any,
    context: {
        visualisation: CodeVisualisation;
        isTransientState: boolean;
    }
}

type View = JSX.Element;

export abstract class UserInterface<
    I extends UserInterfaceInput = UserInterfaceInput,
    O extends UserInterfaceOutput = UserInterfaceOutput
> {
    protected visualisation: CodeVisualisation;
    
    private modelChangeObservers: Set<Observer<O>>;
    private modelChangeNotificationThrottler: Throttler;

    constructor(visualisation: CodeVisualisation) {
        this.visualisation = visualisation;

        this.modelChangeObservers = new Set();
        this.modelChangeNotificationThrottler = new Throttler(
            () => this.notifyModelChangeObservers(),
            this.minDelayBetweenModelChangeNotifications
        )
    }

    protected abstract get modelOutput(): O;
    abstract createView(): View;
    abstract updateModel(input: I): void;

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
}
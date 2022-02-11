import React, { ReactElement } from "react";
import { Observer } from "../../utilities/Observer";
import { Throttler } from "../../utilities/Throttler";
import { DocumentChangeOrigin } from "../documents/Document";
import { DocumentEditor } from "../documents/DocumentEditor";
import { TransientDocumentEditor } from "../documents/TransientDocumentEditor";
import { CodeVisualisation } from "../visualisations/CodeVisualisation";

export interface UserInterfaceInput {}
export interface UserInterfaceOutput {
    data: any,
    context: {
        visualisation: CodeVisualisation;
        isTransientState: boolean;
    },
    editor: DocumentEditor
}

export type PartialUserInterfaceOutput =
    Omit<UserInterfaceOutput, "data">;

export abstract class UserInterface<
    I extends UserInterfaceInput = UserInterfaceInput,
    O extends UserInterfaceOutput = UserInterfaceOutput
> {
    abstract readonly className: string;
    protected visualisation: CodeVisualisation;
    
    private modelChangeObservers: Set<Observer<O>>;
    private modelChangeNotificationThrottler: Throttler;

    protected transientEditor: TransientDocumentEditor | null;

    constructor(visualisation: CodeVisualisation) {
        this.visualisation = visualisation;

        this.modelChangeObservers = new Set();
        this.modelChangeNotificationThrottler = new Throttler(
            () => this.notifyModelChangeObservers(),
            this.minDelayBetweenModelChangeNotifications
        )

        this.transientEditor = null;
    }

    protected abstract get modelOutput(): O;
    abstract createViewContent(): ReactElement;
    abstract updateModel(input: I): void;

    protected startTransientEdit(): void {
        this.transientEditor = new TransientDocumentEditor(
            this.visualisation.document,
            {
                origin: DocumentChangeOrigin.CodeVisualisationEdit,
                visualisation: this.visualisation,
                isTransientChange: true
            }
        )
    }

    protected stopTransientEdit(): void {
        if (this.transientEditor) {
            this.transientEditor.reset();
            this.transientEditor.restoreInitialContent();
        }

        this.transientEditor = null;
    }

    protected getAppropriateDocumentEditor(): DocumentEditor {
        return this.transientEditor ?? new DocumentEditor(
            this.visualisation.document,
            {
                origin: DocumentChangeOrigin.CodeVisualisationEdit,
                visualisation: this.visualisation,
                isTransientChange: false
            }
        );
    }

    protected isInTransientState(): boolean {
        return this.transientEditor !== null;
    }

    protected getPartialModelOutput(): PartialUserInterfaceOutput {
        const editor = this.getAppropriateDocumentEditor();
        editor.reset();

        return {
            context: {
                visualisation: this.visualisation,
                isTransientState: this.isInTransientState()
            },
            editor: editor
        };
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
            data-code-visualisation-id={this.visualisation.id}
            {...uiContainerProps}
        >
            {this.createViewContent()}
        </div>
    }
}
type Task = () => void;

export class Throttler {
    task: Task;
    private timeoutHandle: ReturnType<typeof setTimeout> | null;

    minDelay: number; // ms
    private lastTaskEndTimestamp: number;

    constructor(task: Task, minDelay: number) {
        this.task = task;
        this.timeoutHandle = null;

        this.minDelay = minDelay;
        this.lastTaskEndTimestamp = Number.NEGATIVE_INFINITY;
    }

    private get minTimestampForRunningTheTask(): number {
        return this.lastTaskEndTimestamp + this.minDelay;
    }

    private get taskIsScheduled(): boolean {
        return this.timeoutHandle !== null;
    }

    private get taskIsRunnableNow(): boolean {
        // A task is runnable if the last task ended more than 'minDelay' ms ago.
        return this.minTimestampForRunningTheTask < Date.now();
    }

    runTaskImmediately(): void {
        this.task();
        this.lastTaskEndTimestamp = Date.now();
    }

    private scheduleTask(): void {
        const currentTimestamp = Date.now();

        this.timeoutHandle = setTimeout(
            () => {
                this.runTaskImmediately();
                this.timeoutHandle = null;
            },
            this.minTimestampForRunningTheTask - currentTimestamp
        );
    }

    cancelScheduledTask(): void {
        if (this.timeoutHandle !== null) {
            clearTimeout(this.timeoutHandle);
            this.timeoutHandle = null;
        }
    }

    runOrScheduleTask(): void {
        // Case 1: the task can be ran immediately.
        if (this.taskIsRunnableNow) {
            this.runTaskImmediately();
        }
        // Case 2: the task must be scheduled to be ran in the future.
        // If it is already scheduled, there is nothing to do.
        else {
            if (!this.taskIsScheduled) {
                this.scheduleTask();
            }
        }
    }
}
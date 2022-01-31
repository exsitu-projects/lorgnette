type Task = () => void;

export class Debouncer {
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
        // A task is runnable if it meets both of the following conditions:
        // 1. It is not scheduled to be ran in the future;
        // 2. The last task ended more than 'minDelay' ms ago.
        return !this.taskIsScheduled
            && this.minTimestampForRunningTheTask < Date.now();
    }

    runTaskImmediately(): void {
        // If there is already a scheduled task, cancel it.
        this.cancelScheduledTask();
        
        this.task();
        this.lastTaskEndTimestamp = Date.now();
    }

    private scheduleTask(): void {
        // If there is already a scheduled task, cancel it.
        this.cancelScheduledTask();

        // Schedule the task.
        this.timeoutHandle = setTimeout(
            () => {
                this.runTaskImmediately();
            },
            this.minDelay
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
        else {
            this.scheduleTask();
        }
    }
}
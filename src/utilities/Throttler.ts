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

    runTaskImmediately(): void {
        this.task();
        this.lastTaskEndTimestamp = Date.now();
    }

    scheduleTask(): void {
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
        const currentTimestamp = Date.now();
        const minTimestampForRunningTheTask = this.minTimestampForRunningTheTask;

        // Case 1: enough time passed since the last time the task was executed,
        // so it can be ran again now.
        if (minTimestampForRunningTheTask < currentTimestamp) {
            this.runTaskImmediately();
        }
        // Case 2: the task must wait longer before being ran again.
        // If a task is already scheduled, there is nothing to do.
        else {
            if (!this.taskIsScheduled) {
                this.scheduleTask();
            }
        }
    }
}
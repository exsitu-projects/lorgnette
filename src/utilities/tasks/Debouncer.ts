import { Task } from "./Task";
import { TaskRunner } from "./TaskRunner";

export class Debouncer extends TaskRunner {
    minimumDelayBetweenTasks: number; // ms
    private lastTaskEndTimestamp: number;
    private timeoutHandle: ReturnType<typeof setTimeout> | null;

    constructor(minimumDelayBetweenTasks: number) {
        super();

        this.minimumDelayBetweenTasks = minimumDelayBetweenTasks;
        this.lastTaskEndTimestamp = -Infinity;
        this.timeoutHandle = null;
    }

    private get minTimestampForRunningNextTask(): number {
        return this.lastTaskEndTimestamp + this.minimumDelayBetweenTasks;
    }

    private get hasScheduledNextTask(): boolean {
        return this.timeoutHandle !== null;
    }

    private get canRunTaskNow(): boolean {
        // A task can be ran immediately if both of the following conditions are met:
        // 1. No task is currently running;
        // 2. No task is scheduled to be ran in the future;
        // 3. The last task ended enough time ago.
        return !this.isRunningTask
            && !this.hasScheduledNextTask
            && this.minTimestampForRunningNextTask < Date.now();
    }

    private getNextTaskAndDiscardOthers(): Task | null {
        if (!this.hasTask) {
            return null;
        }

        const nextTask = this.tasks[0];
        this.tasks = [];

        return nextTask;
    }

    private runTask(task: Task): void {
        this.isRunningTask = true;
            Promise.resolve(task())
                .then(() => {
                    this.lastTaskEndTimestamp = Date.now();
                    this.isRunningTask = false;
                });
    }

    private runNextTask(): void {
        const nextTask = this.getNextTaskAndDiscardOthers();
        if (nextTask) {
            this.runTask(nextTask);
        }
    }

    private rescheduleNextTask(): void {
        // If there is already a scheduled task, cancel it.
        this.cancelScheduledTask();

        this.timeoutHandle = setTimeout(() => {
            this.runNextTask();
            this.timeoutHandle = null;
        }, this.minimumDelayBetweenTasks);
    }

    private cancelScheduledTask(): void {
        if (this.timeoutHandle !== null) {
            clearTimeout(this.timeoutHandle);
            this.timeoutHandle = null;
        }
    }

    private runOrRescheduleNextTask(): void {
        // If there is no task left to run, do nothing.
        if (!this.hasTask) {
            return;
        }

        // Otherwise, either run the next task immediately or (re)schedule it in the future.
        if (this.canRunTaskNow) {
            this.runNextTask();
        }
        else {
            this.rescheduleNextTask();
        }
    }

    addTask(task: Task): void {
        this.queue(task, true);
        this.runOrRescheduleNextTask();
    }

    clearTasks(): void {
        super.clearTasks();
        this.cancelScheduledTask();
    }
}
import { Throttler } from "./Throttler";
import { FixedTaskRunner } from "./FixedTaskRunner";
import { Task } from "./Task";

export class FixedThrottler extends FixedTaskRunner {
    readonly throttler: Throttler;

    constructor(task: Task, minimumDelayBetweenTasks: number) {
        super(task);
        this.throttler = new Throttler(minimumDelayBetweenTasks);
    }

    runTask(): void {
        this.throttler.addTask(this.task);
    }
}
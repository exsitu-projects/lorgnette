import { Task } from "./Task";

export abstract class FixedTaskRunner {
    protected task: Task;
    protected isRunningTask: boolean;

    constructor(task: Task) {
        this.task = task;
        this.isRunningTask = false;
    }

    abstract runTask(): void;
}
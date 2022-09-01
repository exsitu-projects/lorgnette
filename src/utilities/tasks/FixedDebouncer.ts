import { Debouncer } from "./Debouncer";
import { FixedTaskRunner } from "./FixedTaskRunner";
import { Task } from "./Task";

export class FixedDebouncer extends FixedTaskRunner {
    readonly debouncer: Debouncer;

    constructor(task: Task, minimumDelayBetweenTasks: number) {
        super(task);
        this.debouncer = new Debouncer(minimumDelayBetweenTasks);
    }

    runTask(): void {
        this.debouncer.addTask(this.task);
    }
}
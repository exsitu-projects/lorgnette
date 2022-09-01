import { Task } from "./Task";

export abstract class TaskRunner {
    protected tasks: Task[];
    protected isRunningTask: boolean;

    constructor() {
        this.tasks = [];
        this.isRunningTask = false;
    }

    get nbTasks(): number {
        return this.tasks.length;
    }

    get hasTask(): boolean {
        return this.nbTasks > 0;
    }

    protected queue(task: Task, addInFrontOfQueue: boolean): void {
        if (addInFrontOfQueue) {
            this.tasks.unshift(task);
        }
        else {
            this.tasks.push(task);
        }
    }

    clearTasks(): void {
        this.tasks = [];
    }

    abstract addTask(task: Task): void;
}
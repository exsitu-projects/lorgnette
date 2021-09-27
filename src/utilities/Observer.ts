export interface Observer<T> {
    processChange(data: T): void;
}
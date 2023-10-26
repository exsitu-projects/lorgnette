export class ArrayMap<K, V> {
    private readonly map: Map<K, V[]>;

    constructor(initialEntries: Iterable<[K, V[]]> = []) {
        this.map = new Map(initialEntries);
    }

    get keys(): IterableIterator<K> {
        return this.map.keys();
    }

    get values(): IterableIterator<V> {
        const map = this.map;
        return (function*() {
            for (let array of map.values()) {
                for (let value of array) {
                    yield value;
                }
            }
        })();
    }

    get entries(): IterableIterator<[K, V[]]> {
        return this.map.entries();
    }

    hasKey(key: K): boolean {
        return this.map.has(key);
    }

    add(key: K, ...values: V[]): void {
        if (!this.hasKey(key)) {
            this.map.set(key, []);
        }

        const currentValues = this.map.get(key);
        currentValues!.push(...values);
    }

    getValuesOf(key: K): V[] {
        if (!this.hasKey(key)) {
            return [];
        }

        return this.map.get(key)!;
    }

    clone(): ArrayMap<K, V> {
        return new ArrayMap(
            [...this.map.entries()]
                .map(([key, values]) => [key, [...values]])
        );
    }

    clear(): void {
        this.map.clear();
    }
}
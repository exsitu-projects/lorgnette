import { LocalStore } from "./LocalStore";

export class LocalStoreManager {
    private static LOCAL_STORAGE_KEY = "lorgnette-store";
    private storage: Storage;

    constructor() {
        if (!window.localStorage) {
            throw new Error("The local store manager cannot be created: there is no local storage.");
        }

        this.storage = window.localStorage;
    }

    getStore(): LocalStore | null {
        try {
            const rawStore = this.storage.getItem(LocalStoreManager.LOCAL_STORAGE_KEY);
            if (rawStore === null) {
                return null;
            }

            return JSON.parse(rawStore);
        }
        catch (exception) {
            console.warn("The local store could not be parsed from the local storage:", exception);
            return null;
        }
    }

    setStore(store: LocalStore): void {
        try {
            const rawStore = JSON.stringify(store);
            this.storage.setItem(LocalStoreManager.LOCAL_STORAGE_KEY, rawStore);
        }
        catch (exception) {
            console.warn("The local store could not be serialised into JSON:", exception);
        }
    }
}

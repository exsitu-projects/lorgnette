import { Document } from "../documents/Document";
import { Fragment } from "./Fragment";

export interface FragmentProvider<T extends Fragment> {
    provideForDocument(document: Document): Promise<T[]>;
}
import { Document } from "../documents/Document";
import { Fragment } from "./Fragment";

export interface FragmentProvider<T extends Fragment> {
    provideFragmentsForDocument(document: Document): Promise<T[]>;
}
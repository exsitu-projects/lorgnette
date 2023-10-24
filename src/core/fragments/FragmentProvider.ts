import { Document } from "../documents/Document";
import { Fragment } from "./Fragment";
import { FragmentType } from "./FragmentType";

export interface FragmentProvider<T extends Fragment = Fragment> {
    type: FragmentType;
    provideFragmentsForDocument(document: Document): Promise<T[]>;
}
import { Document } from "../../documents/Document";
import { Fragment } from "../../fragments/Fragment";
import { RuntimeRequest } from "../RuntimeRequest";

export interface RuntimeRequestContext<F extends Fragment = Fragment> {
    fragment: F;
    document: Document;
}

export interface RuntimeRequestProvider<F extends Fragment = Fragment> {
    provideRuntimeRequests(context: RuntimeRequestContext<F>): RuntimeRequest[];
}

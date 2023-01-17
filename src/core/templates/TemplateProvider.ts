import { Fragment } from "../fragments/Fragment";
import { Template } from "./Template";

export interface TemplateProvider<F extends Fragment = Fragment> {
    provideForDocument(document: Document): Promise<Template<F>>;
}

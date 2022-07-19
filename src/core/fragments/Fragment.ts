import { DocumentRange } from "../documents/DocumentRange";
import { FragmentType } from "./FragmentType";

export interface Fragment {
    type: FragmentType;
    range: DocumentRange;
    text: string;
}
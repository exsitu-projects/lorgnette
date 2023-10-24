import { Document } from "../../../core/documents/Document";
import { CSS_LANGUAGE } from "../../../presets/languages/css/language";

// From https://astexplorer.net/#/gist/244e2fb4da940df52bf0f4b94277db44/e79aff44611020b22cfd9708f3a99ce09b7d67a8.
const text = `
/**
 * Paste or drop some CSS here and explore
 * the syntax tree created by chosen parser.
 * Enjoy!
 */

@media screen and (min-width: 480px) {
    body {
        background-color: lightgreen;
    }
}

#main {
    border: 1px solid black;
}

ul li {
	padding: 5px;
}
`;

export const CSS_EXAMPLE = {
    name: "CSS",
    language: CSS_LANGUAGE,
    content: text.trim()
};
import { Document } from "../../../core/documents/Document";
import { TYPESCRIPT_LANGUAGE } from "../../../core/languages/typescript/language";

const text = 
`const color = new Color(100, 150, 200);
const color2 = new Color(
  255, // some comment ruining the regex
  50,
  25
);

const re1 = new RegExp("Color\\((\\d+)\\s*,\\s*(\\d+)\\s*,\\s*(\\d+)\\)");
const re2 = /^([0-9a-zA-Z]([-.\\w]*[0-9a-zA-Z])*@([0-9a-zA-Z][-\\w]*[0-9a-zA-Z]\\.)+[a-zA-Z]{2,9})$/;

const style = {
  color: "#fedcba"
};

const tsx = (
  <ComponentOne
    propFoo={foo}
    propBar={bar}
  >
    Begin with some text.
    <ComponentTwo />
    <ComponentThree />
    Some text in between...
    <ComponentFour style{{ color: "red" }}>
      <ul>
        <li id="elOne">Element 1</li>
        <li id="elTwo">Element 2</li>
        <li id="elThree">Element 3</li>
      </ul>
    </ComponentFour>
  </ComponentOne>
);
`;

export const TYPESCRIPT_EXAMPLE = {
    name: "Typescript",
    document: new Document(TYPESCRIPT_LANGUAGE, text.trim())
};
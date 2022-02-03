import { Language } from "../Language";
import { TypescriptParser } from "./TypescriptParser";

const codeExample = 
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

export const TYPESCRIPT_LANGUAGE: Language = {
    name: "TypeScript",
    id: "typescript",
    codeEditorLanguageId: "typescript",
    codeExample: codeExample.trim(),
    parser: new TypescriptParser()
};
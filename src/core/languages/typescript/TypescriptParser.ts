import { Parser } from "../Parser";
import { Project, ts } from "ts-morph";

// export class TypescriptParser implements Parser {
//     private project: Project;

//     constructor() {
//         this.project = new Project({
//             useInMemoryFileSystem: true
//         });
//     }

//     parse(text: string): ts.SourceFile {
//         const sourceFile = this.project.createSourceFile(
//             "code-in-editor.ts",
//             text,
//             {
//                 overwrite: true
//             }
//         );

//         const d = sourceFile.getDescendants();
//         const sf = sourceFile.compilerNode;

//         console.log("d", d);
//         console.log("sf", sf);

//         return sf;
//     }
// }
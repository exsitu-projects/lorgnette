import { SyntacticPattern } from "../core/code-patterns/syntactic/SyntacticPattern";
import { SyntacticPatternFinder } from "../core/code-patterns/syntactic/SyntacticPatternFinder";
import { SyntaxTreeNode } from "../core/languages/SyntaxTreeNode";
import { SyntaxTreePattern, SKIP_MATCH_DESCENDANTS } from "../core/languages/SyntaxTreePattern";
import { ProgrammableInputMapping } from "../core/mappings/ProgrammableInputMapping";
import { ProgrammableOutputMapping } from "../core/mappings/ProgrammableOutputMapping";
import { AsideRenderer } from "../core/renderers/aside/AsideRenderer";
import { AsideRendererPosition } from "../core/renderers/aside/AsideRendererSettings";
import { Tree, TreeNode } from "../core/user-interfaces/tree/Tree";
import { NodeMoveProcesser } from "../core/user-interfaces/tree/utilities/NodeMoveProcesser";
import { SyntacticCodeVisualisationProvider } from "../core/visualisations/syntactic/SyntacticCodeVisualisationProvider";

export const tsxComponentVisualisationProvider = new SyntacticCodeVisualisationProvider(
    "TSX elements",
    { languages: ["typescript"] },
    new SyntacticPatternFinder(new SyntaxTreePattern(
        n => ["JsxElement", "JsxSelfClosingElement"].includes(n.type),
        SKIP_MATCH_DESCENDANTS
    )),
    [],
    new ProgrammableInputMapping(arg => {
        const pattern = arg.pattern as SyntacticPattern;
        
        const getJsxElementNameFromNode = (node: SyntaxTreeNode, defaultName: string): string => {
            const regex = /<\s*(\w+).*/;
            const regexMatch = regex.exec(node.parserNode.getFullText() as string);
            
            return regexMatch ? regexMatch[1] : defaultName;
        };
        
        const abbreviateJsxElementContent = (node: SyntaxTreeNode): string => {
            return node.parserNode.getFullText() as string;
        };
        
        const findTsxTreeItems = (node: SyntaxTreeNode): TreeNode<SyntaxTreeNode> | null => {
            let jsxElementName = "";
            
            const createNode = (title: string, preTitle: string) => {
                return {
                    title: title,
                    preTitle: preTitle,
                    data: node,
                    canMove: true
                };
            };
            
            switch (node.type) {
                case "JsxElement":
                    jsxElementName = getJsxElementNameFromNode(node, "<JSX element>");
                    const syntaxListNodes = node.childNodes.find(n => n.type === "SyntaxList");
                
                    return {
                        ...createNode(jsxElementName, "</>"),
                        children: syntaxListNodes
                        ? syntaxListNodes.childNodes
                        .map(n => findTsxTreeItems(n))
                        .filter(n => n !== null) as TreeNode[]
                        : []
                    };
                
                case "JsxSelfClosingElement":
                    jsxElementName = getJsxElementNameFromNode(node, "<Self-closing JSX element>");
                    return createNode(jsxElementName, "</>");
                
                case "JsxText":
                    return node.isEmpty()
                        ? null
                        : createNode(abbreviateJsxElementContent(node), "Abc");
                
                case "JsxExpression":
                    return createNode(abbreviateJsxElementContent(node), "{…}");
                
                default:
                    return null;
            }
        }
        
        return findTsxTreeItems(pattern.node) as TreeNode;
    }),
    new ProgrammableOutputMapping(arg => {
        const output = arg.output;
        NodeMoveProcesser.processTreeOutput(output, arg.document);
    }),
    Tree.makeProvider<SyntaxTreeNode>(),
    AsideRenderer.makeProvider({
        onlyShowWhenCursorIsInRange: true,
        position: AsideRendererPosition.RightSideOfEditor
    })
);

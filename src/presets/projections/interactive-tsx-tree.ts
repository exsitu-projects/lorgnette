import { TreePatternFinder } from "../../core/fragments/syntactic/TreePatternFinder";
import { SyntaxTreeNode } from "../../core/languages/SyntaxTreeNode";
import { SyntaxTreePattern, SKIP_MATCH_DESCENDANTS } from "../../core/languages/SyntaxTreePattern";
import { ProgrammableBackwardMapping } from "../../core/mappings/ProgrammableBackwardMapping";
import { SideRendererPosition } from "../renderers/side/SideRendererSettings";
import { TreeNode } from "../user-interfaces/tree/Tree";
import { NodeMoveProcesser } from "../user-interfaces/tree/utilities/NodeMoveProcesser";
import { ProjectionSpecification } from "../../core/projections/ProjectionSpecification";
import { SyntacticFragment } from "../../core/fragments/syntactic/SyntacticFragment";
import { ProgrammableForwardMapping } from "../../core/mappings/ProgrammableForwardMapping";

const forwardMapping = new ProgrammableForwardMapping<SyntacticFragment>(({ fragment }) => {
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
    
    return findTsxTreeItems(fragment.node) as TreeNode;
});

const backwardMapping = new ProgrammableBackwardMapping<SyntacticFragment>(({ userInterfaceOutput, document, documentEditor }) => {
    NodeMoveProcesser.processTreeOutput(userInterfaceOutput, document, documentEditor);
});

export const interactiveTsxTreeSpecification: ProjectionSpecification<SyntacticFragment> = {
    name: "Interactive TSX tree",

    requirements: { languages: ["typescript"] },

    pattern: new TreePatternFinder(new SyntaxTreePattern(
        n => ["JsxElement", "JsxSelfClosingElement"].includes(n.type),
        SKIP_MATCH_DESCENDANTS
    )),

    forwardMapping: forwardMapping,

    backwardMapping: backwardMapping,

    userInterface: "tree",
    
    renderer: {
        name: "side",
        settings: {
            onlyShowWhenCursorIsInRange: true,
            position: SideRendererPosition.RightSideOfEditor
        }
    }
};

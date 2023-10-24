import { CssLocation, CssNode, List } from "css-tree";
import { Document } from "../../../core/documents/Document";
import { ABSOLUTE_ORIGIN_POSITION, Position } from "../../../core/documents/Position";
import { Range } from "../../../core/documents/Range";
import { SyntaxTreeNode } from "../../../core/languages/SyntaxTreeNode";
import { CssParserContext } from "./CssParser";

export class CssSyntaxTreeNode extends SyntaxTreeNode {
    readonly type: string;
    readonly range: Range;
    readonly childNodes: CssSyntaxTreeNode[];
    readonly parserNode: CssNode;

    constructor(
        type: string,
        range: Range,
        childNodes: CssSyntaxTreeNode[],
        parserNode: CssNode,
        sourceDocument: Document
    ) {
        super(sourceDocument);
        this.type = type;
        this.range  = range;
        this.childNodes = childNodes;
        this.parserNode = parserNode;
    }

    static fromCssTreeNode(parserNode: CssNode, parserContext: CssParserContext): CssSyntaxTreeNode {
        const type = parserNode.type;

        const cssTreeLocation = parserNode.loc;
        const range = cssTreeLocation
            ? CssSyntaxTreeNode.getRangeFromCssTreeLocation(cssTreeLocation)
            : Range.fromSinglePosition(ABSOLUTE_ORIGIN_POSITION);

        // Get all the child nodes of the given parser nodes.
        const childCssTreeNodes: CssNode[] = [];
        const addCssChildNodesIfAny = (childOrChildren: CssNode | List<CssNode> | null) => {
            if (!childOrChildren) {
                return;
            }

            if (childOrChildren instanceof List) {
                childCssTreeNodes.push(...childOrChildren.toArray())
            }
            else {
                childCssTreeNodes.push(childOrChildren)
            }
        };

        // Since css-tree does not offer any interface (besides the visitor?) to iterate on child nodes,
        // we manually add the nodes listed in certain properties according to the type of the given node.
        // Note: the order the properties are picked is important as it affects the order of the child nodes
        // in the resulting AST node (which should follow their order in the code).
        switch (parserNode.type) {
            // Nodes with "prelude" and "block" properties.
            case "Atrule":
            case "Rule":
                addCssChildNodesIfAny(parserNode.prelude);
                addCssChildNodesIfAny(parserNode.block);
                break;

            // Nodes with "children" property.
            case "AtrulePrelude":
            case "Block":
            case "Brackets":
            case "DeclarationList":
            case "Function":
            case "MediaQuery":
            case "MediaQueryList":
            case "Parentheses":
            case "PseudoClassSelector":
            case "Selector":
            case "SelectorList":
            case "StyleSheet":
            case "Value":
                addCssChildNodesIfAny(parserNode.children);
                break;

            // Nodes with "name" and "value" property (containing other nodes).
            case "AttributeSelector":
                addCssChildNodesIfAny(parserNode.name);
                addCssChildNodesIfAny(parserNode.value);
                break;

            // Nodes with "value" property (containing other nodes).
            case "MediaFeature":
            case "Declaration":
                addCssChildNodesIfAny(parserNode.value);
                break;
            
            // Nodes with "nth" and "selector" property.
            case "Nth":
                addCssChildNodesIfAny(parserNode.nth);
                addCssChildNodesIfAny(parserNode.selector);
                break;
        }

        const childNodes = childCssTreeNodes.map(cssTreeNode =>
            CssSyntaxTreeNode.fromCssTreeNode(cssTreeNode, parserContext)
        );

        return new CssSyntaxTreeNode(type, range, childNodes, parserNode, parserContext.sourceDocument);
    }

    private static getRangeFromCssTreeLocation(location: CssLocation): Range {
        return new Range(
            new Position(location.start.line - 1, location.start.column - 1, location.start.offset),
            new Position(location.end.line - 1, location.end.column - 1, location.end.offset)
        );
    }
}
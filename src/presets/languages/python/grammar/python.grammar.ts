import * as moo from "moo";
// Generated automatically by nearley, version 2.20.1
// http://github.com/Hardmath123/nearley
// Bypasses TS6133. Allow declared but unused functions.
// @ts-ignore
function id(d: any[]): any { return d[0]; }
declare var identifier: any;
declare var singleQuoteLongString: any;
declare var doubleQuoteLongString: any;
declare var singleQuoteString: any;
declare var doubleQuoteString: any;
declare var number: any;
declare var space: any;

    // Note : string regexes are based on https://docs.python.org/3/reference/lexical_analysis.html.
    const lexer = moo.compile({
        space: {match: /\s+/, lineBreaks: true},
        number: /-?(?:[0-9]|[1-9][0-9]+)(?:\.[0-9]+)?(?:[eE][-+]?[0-9]+)?\b/,
        // stringPrefix: /r|u|R|U|f|F|fr|Fr|fR|FR|rf|rF|Rf|RF/,
        singleQuoteLongString: {match: /'''(?:\\.|[^\\])*'''/, lineBreaks: true},
        doubleQuoteLongString: {match: /"""(?:\\.|[^\\])*"""/, lineBreaks: true},
        singleQuoteString: /'(?:\\[^n]|[^'\\])*'/,
        doubleQuoteString: /"(?:\\[^n]|[^"\\])*"/,
        // string: /"(?:\\["bfnrt\/\\]|\\u[a-fA-F0-9]{4}|[^"\\])*"/,
        "{": "{",
        "}": "}",
        "[": "[",
        "]": "]",
        "(": "(",
        ")": ")",
        ",": ",",
        ".": ".",
        "=": "=",
        "'": "'",
        "\"": "\"",
        true: "True",
        false: "False",
        none: "None",
        identifier: {
            match: /[a-zA-Z_][a-zA-Z0-9_]*/,
        },
    })


    // Helper function to create a "node" that will later be turned into an actual AST node.
    const Node = (
        type: string,
        propertiesDictOrDictBuilder: (object | ((data: any[]) => object)) = {},
        dataTransformer?: (data: any[]) => any[]
    ) => {
        return (data: any[], location: number | undefined, reject: any) => {
            data = !!dataTransformer ? dataTransformer(data) : data;

            // console.info(`= Creating node type: ${type} =`)
            // console.log(data)

            // We only operate on well-defined child nodes that have an offset position.
            const childNodes = data.filter((parserNode: any) =>
                !!parserNode && "offset" in parserNode
            );
            
            // If there aren't any in the given data, we do not create any node.
            if (childNodes.length === 0) {
                return null;
            }

            const firstNonEmptyNode = childNodes[0];
            const lastNonEmptyNode = childNodes[childNodes.length - 1];

            // This function recursively concatenate the text of the child nodes
            // in order to create the text of the current node.
            const extractTextOfNodes = (parserNodes: any[]): string => {
                return parserNodes.reduce((text: string, node: any) => {
                    if (!node || !("text" in node)) {
                        return text;
                    }

                    return text.concat(Array.isArray(node)
                        ? extractTextOfNodes(node)
                        : node.text)
                }, "")
            };

            // Either get or generate the other properties to include in the node.
            const otherProperties = typeof propertiesDictOrDictBuilder === "function"
                ? propertiesDictOrDictBuilder(data)
                : propertiesDictOrDictBuilder;

            return {
                type: type,
                text: extractTextOfNodes(data),
                offset: firstNonEmptyNode.offset,
                endOffset: lastNonEmptyNode.offset + lastNonEmptyNode.text.length,
                data: data,
                ...otherProperties
            };
        }
    }

    function extractListElements(listData: any[]) {
        // console.log("LIST DATA !!!", [
        //     listData[0],
        //     listData[1][0][0],
        //     // ...listData[2].map((d: any[]) => d[3][0][0]),
        //     ...listData[2].reduce((acc: any[], d: any[]) => [
        //         ...acc,
        //         ...[
        //             d[0],
        //             d[1][0],
        //             d[2],
        //             d[3][0][0]
        //         ].filter(n => !!n && !Array.isArray(n))
        //     ],
        //     []),
        //     listData[3]
        // ], listData[2])// 
        return [
            listData[0],
            listData[1][0][0],
            ...listData[2].reduce((acc: any[], d: any[]) => [
                ...acc,
                ...[
                    d[0],
                    d[1][0],
                    d[2],
                    d[3][0][0]
                ].filter(n => !!n && !Array.isArray(n))
            ],
            []),
            listData[3]
        ];
    }

    function createListsOfArguments(data: any[]) {
        return {
            positionalArguments: data.filter((n: any) => !!n && n.type === "PositionalArgument"),
            namedArguments: data.filter((n: any) => !!n && n.type === "NamedArgument")
        };
    }

interface NearleyToken {
  value: any;
  [key: string]: any;
};

interface NearleyLexer {
  reset: (chunk: string, info: any) => void;
  next: () => NearleyToken | undefined;
  save: () => any;
  formatError: (token: never) => string;
  has: (tokenType: string) => boolean;
};

interface NearleyRule {
  name: string;
  symbols: NearleySymbol[];
  postprocess?: (d: any[], loc?: number, reject?: {}) => any;
};

type NearleySymbol = string | { literal: any } | { test: (token: any) => boolean };

interface Grammar {
  Lexer: NearleyLexer | undefined;
  ParserRules: NearleyRule[];
  ParserStart: string;
};

const grammar: Grammar = {
  Lexer: lexer,
  ParserRules: [
    {"name": "program$ebnf$1", "symbols": []},
    {"name": "program$ebnf$1", "symbols": ["program$ebnf$1", "instruction"], "postprocess": (d) => d[0].concat([d[1]])},
    {"name": "program", "symbols": ["program$ebnf$1"], "postprocess": Node("Program", d => { return { instructions: d }; }, d => d[0])},
    {"name": "instruction", "symbols": ["_", "expression", "_"], "postprocess": d => d[1]},
    {"name": "expression", "symbols": ["number"], "postprocess": Node("Expression", d => { return { value: d[0] }; })},
    {"name": "expression", "symbols": ["boolean"], "postprocess": Node("Expression", d => { return { value: d[0] }; })},
    {"name": "expression", "symbols": ["none"], "postprocess": Node("Expression", d => { return { value: d[0] }; })},
    {"name": "expression", "symbols": ["functionCall"], "postprocess": Node("Expression", d => { return { value: d[0] }; })},
    {"name": "expression", "symbols": ["indexedAccess"], "postprocess": Node("Expression", d => { return { value: d[0] }; })},
    {"name": "expression", "symbols": ["namedAccess"], "postprocess": Node("Expression", d => { return { value: d[0] }; })},
    {"name": "expression", "symbols": ["id"], "postprocess": Node("Expression", d => { return { value: d[0] }; })},
    {"name": "expression", "symbols": ["string"], "postprocess": Node("Expression", d => { return { value: d[0] }; })},
    {"name": "indexableExpression", "symbols": ["number"], "postprocess": id},
    {"name": "indexableExpression", "symbols": ["boolean"], "postprocess": id},
    {"name": "indexableExpression", "symbols": ["functionCall"], "postprocess": id},
    {"name": "indexableExpression", "symbols": ["indexedAccess"], "postprocess": id},
    {"name": "indexableExpression", "symbols": ["namedAccess"], "postprocess": id},
    {"name": "indexableExpression", "symbols": ["id"], "postprocess": id},
    {"name": "indexableExpression", "symbols": ["string"], "postprocess": id},
    {"name": "callableExpression", "symbols": ["functionCall"], "postprocess": id},
    {"name": "callableExpression", "symbols": ["indexedAccess"], "postprocess": id},
    {"name": "callableExpression", "symbols": ["namedAccess"], "postprocess": id},
    {"name": "callableExpression", "symbols": ["id"], "postprocess": id},
    {"name": "namedAccess", "symbols": ["indexableExpression", {"literal":"."}, "id"], "postprocess": Node("NamedAccess", d => { return { expression: d[0], identifier: d[2] }; })},
    {"name": "indexedAccess", "symbols": ["indexableExpression", {"literal":"["}, "_", "expression", "_", {"literal":"]"}], "postprocess": Node("IndexedAccess", d => { return { expression: d[0], index: d[3] }; })},
    {"name": "functionCall", "symbols": ["callableExpression", "argumentList"], "postprocess": Node("FunctionCall", d => { return { callee: d[0], argumentList: d[1] }; })},
    {"name": "argumentList$macrocall$2", "symbols": ["positionalArgument"]},
    {"name": "argumentList$macrocall$1$macrocall$2", "symbols": ["argumentList$macrocall$2"]},
    {"name": "argumentList$macrocall$1$macrocall$3", "symbols": [{"literal":","}]},
    {"name": "argumentList$macrocall$1$macrocall$1$ebnf$1", "symbols": []},
    {"name": "argumentList$macrocall$1$macrocall$1$ebnf$1$subexpression$1", "symbols": ["_", "argumentList$macrocall$1$macrocall$3", "_", "argumentList$macrocall$1$macrocall$2"]},
    {"name": "argumentList$macrocall$1$macrocall$1$ebnf$1", "symbols": ["argumentList$macrocall$1$macrocall$1$ebnf$1", "argumentList$macrocall$1$macrocall$1$ebnf$1$subexpression$1"], "postprocess": (d) => d[0].concat([d[1]])},
    {"name": "argumentList$macrocall$1$macrocall$1", "symbols": ["_", "argumentList$macrocall$1$macrocall$2", "argumentList$macrocall$1$macrocall$1$ebnf$1", "_"], "postprocess": d => extractListElements(d)},
    {"name": "argumentList$macrocall$1", "symbols": ["argumentList$macrocall$1$macrocall$1"], "postprocess": id},
    {"name": "argumentList$macrocall$4", "symbols": ["namedArgument"]},
    {"name": "argumentList$macrocall$3$macrocall$2", "symbols": ["argumentList$macrocall$4"]},
    {"name": "argumentList$macrocall$3$macrocall$3", "symbols": [{"literal":","}]},
    {"name": "argumentList$macrocall$3$macrocall$1$ebnf$1", "symbols": []},
    {"name": "argumentList$macrocall$3$macrocall$1$ebnf$1$subexpression$1", "symbols": ["_", "argumentList$macrocall$3$macrocall$3", "_", "argumentList$macrocall$3$macrocall$2"]},
    {"name": "argumentList$macrocall$3$macrocall$1$ebnf$1", "symbols": ["argumentList$macrocall$3$macrocall$1$ebnf$1", "argumentList$macrocall$3$macrocall$1$ebnf$1$subexpression$1"], "postprocess": (d) => d[0].concat([d[1]])},
    {"name": "argumentList$macrocall$3$macrocall$1", "symbols": ["_", "argumentList$macrocall$3$macrocall$2", "argumentList$macrocall$3$macrocall$1$ebnf$1", "_"], "postprocess": d => extractListElements(d)},
    {"name": "argumentList$macrocall$3", "symbols": ["argumentList$macrocall$3$macrocall$1"], "postprocess": id},
    {"name": "argumentList", "symbols": [{"literal":"("}, "argumentList$macrocall$1", {"literal":","}, "argumentList$macrocall$3", {"literal":")"}], "postprocess": Node("ArgumentList", d => createListsOfArguments(d), d => [d[0], ...d[1], d[2], ...d[3], d[4]])},
    {"name": "argumentList$macrocall$6", "symbols": ["namedArgument"]},
    {"name": "argumentList$macrocall$5$macrocall$2", "symbols": ["argumentList$macrocall$6"]},
    {"name": "argumentList$macrocall$5$macrocall$3", "symbols": [{"literal":","}]},
    {"name": "argumentList$macrocall$5$macrocall$1$ebnf$1", "symbols": []},
    {"name": "argumentList$macrocall$5$macrocall$1$ebnf$1$subexpression$1", "symbols": ["_", "argumentList$macrocall$5$macrocall$3", "_", "argumentList$macrocall$5$macrocall$2"]},
    {"name": "argumentList$macrocall$5$macrocall$1$ebnf$1", "symbols": ["argumentList$macrocall$5$macrocall$1$ebnf$1", "argumentList$macrocall$5$macrocall$1$ebnf$1$subexpression$1"], "postprocess": (d) => d[0].concat([d[1]])},
    {"name": "argumentList$macrocall$5$macrocall$1", "symbols": ["_", "argumentList$macrocall$5$macrocall$2", "argumentList$macrocall$5$macrocall$1$ebnf$1", "_"], "postprocess": d => extractListElements(d)},
    {"name": "argumentList$macrocall$5", "symbols": ["argumentList$macrocall$5$macrocall$1"], "postprocess": id},
    {"name": "argumentList", "symbols": [{"literal":"("}, "argumentList$macrocall$5", {"literal":")"}], "postprocess": Node("ArgumentList", d => createListsOfArguments(d), d => [d[0], ...d[1], d[2]])},
    {"name": "argumentList$macrocall$8", "symbols": ["positionalArgument"]},
    {"name": "argumentList$macrocall$7$macrocall$2", "symbols": ["argumentList$macrocall$8"]},
    {"name": "argumentList$macrocall$7$macrocall$3", "symbols": [{"literal":","}]},
    {"name": "argumentList$macrocall$7$macrocall$1$ebnf$1", "symbols": []},
    {"name": "argumentList$macrocall$7$macrocall$1$ebnf$1$subexpression$1", "symbols": ["_", "argumentList$macrocall$7$macrocall$3", "_", "argumentList$macrocall$7$macrocall$2"]},
    {"name": "argumentList$macrocall$7$macrocall$1$ebnf$1", "symbols": ["argumentList$macrocall$7$macrocall$1$ebnf$1", "argumentList$macrocall$7$macrocall$1$ebnf$1$subexpression$1"], "postprocess": (d) => d[0].concat([d[1]])},
    {"name": "argumentList$macrocall$7$macrocall$1", "symbols": ["_", "argumentList$macrocall$7$macrocall$2", "argumentList$macrocall$7$macrocall$1$ebnf$1", "_"], "postprocess": d => extractListElements(d)},
    {"name": "argumentList$macrocall$7", "symbols": ["argumentList$macrocall$7$macrocall$1"], "postprocess": id},
    {"name": "argumentList", "symbols": [{"literal":"("}, "argumentList$macrocall$7", {"literal":")"}], "postprocess": Node("ArgumentList", d => createListsOfArguments(d), d => [d[0], ...d[1], d[2]])},
    {"name": "argumentList", "symbols": [{"literal":"("}, "_", {"literal":")"}], "postprocess": Node("ArgumentList", d => createListsOfArguments(d))},
    {"name": "positionalArgument", "symbols": ["expression"], "postprocess": Node("PositionalArgument", d => { return { value: d[0] }; })},
    {"name": "namedArgument", "symbols": [(lexer.has("identifier") ? {type: "identifier"} : identifier), "_", {"literal":"="}, "_", "expression"], "postprocess": Node("NamedArgument", d => { return { name: d[0], value: d[4] }; })},
    {"name": "string", "symbols": [(lexer.has("singleQuoteLongString") ? {type: "singleQuoteLongString"} : singleQuoteLongString)], "postprocess": Node("String", d => { return { delimiter: "'''", value: d[0].value }; })},
    {"name": "string", "symbols": [(lexer.has("doubleQuoteLongString") ? {type: "doubleQuoteLongString"} : doubleQuoteLongString)], "postprocess": Node("String", d => { return { delimiter: "\"\"\"", value: d[0].value }; })},
    {"name": "string", "symbols": [(lexer.has("singleQuoteString") ? {type: "singleQuoteString"} : singleQuoteString)], "postprocess": Node("String", d => { return { delimiter: "'", value: d[0].value }; })},
    {"name": "string", "symbols": [(lexer.has("doubleQuoteString") ? {type: "doubleQuoteString"} : doubleQuoteString)], "postprocess": Node("String", d => { return { delimiter: "\"", value: d[0].value }; })},
    {"name": "number", "symbols": [(lexer.has("number") ? {type: "number"} : number)], "postprocess": Node("Number", d => { return { value: d[0] }; })},
    {"name": "boolean", "symbols": [{"literal":"True"}], "postprocess": Node("Boolean", { value: true })},
    {"name": "boolean", "symbols": [{"literal":"False"}], "postprocess": Node("Boolean", { value: false })},
    {"name": "none", "symbols": [{"literal":"None"}], "postprocess": Node("None")},
    {"name": "id", "symbols": [(lexer.has("identifier") ? {type: "identifier"} : identifier)], "postprocess": Node("Identifier", d => { return { name: d[0] }; })},
    {"name": "_", "symbols": []},
    {"name": "_", "symbols": [(lexer.has("space") ? {type: "space"} : space)], "postprocess": id}
  ],
  ParserStart: "program",
};

export default grammar;

import * as moo from "moo";

// Generated automatically by nearley, version 2.20.1
// http://github.com/Hardmath123/nearley
// Bypasses TS6133. Allow declared but unused functions.
// @ts-ignore
function id(d: any[]): any { return d[0]; }
declare var number: any;
declare var string: any;
declare var space: any;

    const lexer = moo.compile({
        space: {match: /\s+/, lineBreaks: true},
        number: /-?(?:[0-9]|[1-9][0-9]+)(?:\.[0-9]+)?(?:[eE][-+]?[0-9]+)?\b/,
        string: /"(?:\\["bfnrt\/\\]|\\u[a-fA-F0-9]{4}|[^"\\])*"/,
        "{": "{",
        "}": "}",
        "[": "[",
        "]": "]",
        ",": ",",
        ":": ":",
        true: "true",
        false: "false",
        null: "null",
    })


    // Helper function to create a node of the given type that contains
    // the key/value pairs in the dict. returned by
    // the given node properties generator + location information.
    const Node = (
        type: string,
        propertiesDictOrComputer: (object | ((data: any[]) => object)) = {}
    ) => {
        return (data: any[], location: number | undefined, reject: any) => {
            const nonEmptyChildNodes = data.filter((parserNode: any) =>
                !!parserNode && "offset" in parserNode
            )

            if (nonEmptyChildNodes.length === 0) {
                return null;
            }

            const extractTextOfNodes = (parserNodes: any[]): string => {
                return parserNodes.reduce((text: string, node: any) => {
                    return text.concat(Array.isArray(node)
                        ? extractTextOfNodes(node)
                        : node.text)
                }, "")
            };

            const otherProperties = typeof propertiesDictOrComputer === "function"
                ? propertiesDictOrComputer(data)
                : propertiesDictOrComputer;

            return {
                type: type,
                text: extractTextOfNodes(data),
                offset: nonEmptyChildNodes[0].offset,
                data: data,
                ...otherProperties
            };
        }
    }

    function extractPropertyKeyValue(data: any[]) {
        return {
            key: data[0],
            value: data[4]
        };
    }

    function extractArrayValues(data: any[]) {
        return [
            data[2],
            ...data[3].map((d: any[]) => d[3])
        ];
    }

    function extractObjectProperties(data: any[]) {
        return [
            data[2],
            ...data[3].map((d: any[]) => d[3])
        ];
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
    {"name": "json$subexpression$1", "symbols": ["object"]},
    {"name": "json$subexpression$1", "symbols": ["array"]},
    {"name": "json", "symbols": ["_", "json$subexpression$1", "_"], "postprocess": d => d[1]},
    {"name": "object", "symbols": [{"literal":"{"}, "_", {"literal":"}"}], "postprocess": Node("Object", { properties: [] })},
    {"name": "object$ebnf$1", "symbols": []},
    {"name": "object$ebnf$1$subexpression$1", "symbols": ["_", {"literal":","}, "_", "pair"]},
    {"name": "object$ebnf$1", "symbols": ["object$ebnf$1", "object$ebnf$1$subexpression$1"], "postprocess": (d) => d[0].concat([d[1]])},
    {"name": "object", "symbols": [{"literal":"{"}, "_", "pair", "object$ebnf$1", "_", {"literal":"}"}], "postprocess": Node("Object", d => { return { properties: extractObjectProperties(d) }; })},
    {"name": "array", "symbols": [{"literal":"["}, "_", {"literal":"]"}], "postprocess": Node("Array", { values: [] })},
    {"name": "array$ebnf$1", "symbols": []},
    {"name": "array$ebnf$1$subexpression$1", "symbols": ["_", {"literal":","}, "_", "value"]},
    {"name": "array$ebnf$1", "symbols": ["array$ebnf$1", "array$ebnf$1$subexpression$1"], "postprocess": (d) => d[0].concat([d[1]])},
    {"name": "array", "symbols": [{"literal":"["}, "_", "value", "array$ebnf$1", "_", {"literal":"]"}], "postprocess": Node("Array", d => { return { values: extractArrayValues(d) }; })},
    {"name": "value", "symbols": ["object"], "postprocess": d => d[0]},
    {"name": "value", "symbols": ["array"], "postprocess": d => d[0]},
    {"name": "value", "symbols": ["number"], "postprocess": d => d[0]},
    {"name": "value", "symbols": ["string"], "postprocess": d => d[0]},
    {"name": "value", "symbols": [{"literal":"true"}], "postprocess": Node("Boolean", { value: true })},
    {"name": "value", "symbols": [{"literal":"false"}], "postprocess": Node("Boolean", { value: false })},
    {"name": "value", "symbols": [{"literal":"null"}], "postprocess": Node("Null")},
    {"name": "number", "symbols": [(lexer.has("number") ? {type: "number"} : number)], "postprocess": Node("Number", d => { return { value: d[0] }; })},
    {"name": "string", "symbols": [(lexer.has("string") ? {type: "string"} : string)], "postprocess": Node("String", d => { return { value: d[0] }; })},
    {"name": "pair", "symbols": ["key", "_", {"literal":":"}, "_", "value"], "postprocess": Node("Property", d => { return extractPropertyKeyValue(d); })},
    {"name": "key", "symbols": [(lexer.has("string") ? {type: "string"} : string)], "postprocess": Node("Key", d => { return { value: d[0] }; })},
    {"name": "_", "symbols": []},
    {"name": "_", "symbols": [(lexer.has("space") ? {type: "space"} : space)], "postprocess": id}
  ],
  ParserStart: "json",
};

export default grammar;

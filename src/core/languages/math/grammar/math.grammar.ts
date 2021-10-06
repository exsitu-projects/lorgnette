import * as moo from "moo";

// Generated automatically by nearley, version 2.20.1
// http://github.com/Hardmath123/nearley
// Bypasses TS6133. Allow declared but unused functions.
// @ts-ignore
function id(d: any[]): any { return d[0]; }
declare var leftPar: any;
declare var rightPar: any;
declare var powerOp: any;
declare var multOp: any;
declare var divOp: any;
declare var addOp: any;
declare var subOp: any;
declare var funcName: any;
declare var constant: any;
declare var number: any;
declare var whitespace: any;

    const lexer = moo.compile({
        leftPar: "(",
        rightPar: ")",
        powerOp: "^",
        multOp: "*",
        divOp: "/",
        addOp: "+",
        subOp: "-",
        whitespace: { match: /\s+/, lineBreaks: true },
        number: /[0-9]+(?:.[0-9]+)?/,
        identifier: {
            match: /[a-zA-Z]+/,
            type: moo.keywords({
                constant: ["pi", "e"],
                funcName: ["sin", "cos", "tan", "asin", "acos", "atan", "sqrt", "ln"],
            })
        },
    });


    // Helper function to create a node of the given type that contains
    // the key/value pairs in the dict. returned by
    // the given node properties generator + location information.
    const Node = (
        type: string,
        valueComputer: (data: any[]) => number,
        propertiesDictOrComputer: (object | ((data: any[]) => object)) = {}
    ) => {
        return (data: any[], location: number | undefined, reject: any) => {
            const nonNullChildNodes = data.filter((parserNode: any) => parserNode !== null)
            if (nonNullChildNodes.length === 0) {
              return null;
            }

            const otherProperties = propertiesDictOrComputer instanceof Function
                ? propertiesDictOrComputer(data)
                : propertiesDictOrComputer;

            return {
                type: type,
                text: nonNullChildNodes.reduce((acc, node) => acc.concat(node.text), ""),
                offset: nonNullChildNodes[0].offset,
                data: data,
                value: valueComputer(data),
                ...otherProperties
            };
        }
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
    {"name": "main", "symbols": ["_", "AS", "_"], "postprocess": Node("Expression", d => d[1].value)},
    {"name": "P", "symbols": [(lexer.has("leftPar") ? {type: "leftPar"} : leftPar), "_", "AS", "_", (lexer.has("rightPar") ? {type: "rightPar"} : rightPar)], "postprocess": Node("Parentheses", d => d[2].value)},
    {"name": "P", "symbols": ["N"], "postprocess": id},
    {"name": "E", "symbols": ["P", (lexer.has("powerOp") ? {type: "powerOp"} : powerOp), "E"], "postprocess": Node("Exponent", d => Math.pow(d[0].value, d[2].value))},
    {"name": "E", "symbols": ["P"], "postprocess": id},
    {"name": "MD", "symbols": ["MD", "_", (lexer.has("multOp") ? {type: "multOp"} : multOp), "_", "E"], "postprocess": Node("Multiplication", d => d[0].value * d[4].value)},
    {"name": "MD", "symbols": ["MD", "_", (lexer.has("divOp") ? {type: "divOp"} : divOp), "_", "E"], "postprocess": Node("Division", d => d[0].value / d[4].value)},
    {"name": "MD", "symbols": ["E"], "postprocess": id},
    {"name": "AS", "symbols": ["AS", "_", (lexer.has("addOp") ? {type: "addOp"} : addOp), "_", "MD"], "postprocess": Node("Addition", d => d[0].value + d[4].value)},
    {"name": "AS", "symbols": ["AS", "_", (lexer.has("subOp") ? {type: "subOp"} : subOp), "_", "MD"], "postprocess": Node("Substraction", d => d[0].value - d[4].value)},
    {"name": "AS", "symbols": ["MD"], "postprocess": id},
    {"name": "N", "symbols": ["number"], "postprocess": id},
    {"name": "N", "symbols": [(lexer.has("funcName") ? {type: "funcName"} : funcName), "P"], "postprocess": Node("Function", d => Math.sin(d[1].value), d => { return { name: d[0], }; })},
    {"name": "N", "symbols": [(lexer.has("constant") ? {type: "constant"} : constant)], "postprocess": Node("Constant", d => 0, d => { return { name: d[0], }; })},
    {"name": "number", "symbols": [(lexer.has("number") ? {type: "number"} : number)], "postprocess": Node("Number", d => parseFloat(d[0]))},
    {"name": "_$ebnf$1", "symbols": [(lexer.has("whitespace") ? {type: "whitespace"} : whitespace)], "postprocess": id},
    {"name": "_$ebnf$1", "symbols": [], "postprocess": () => null},
    {"name": "_", "symbols": ["_$ebnf$1"], "postprocess": Node("Whitespace", d => NaN)}
  ],
  ParserStart: "main",
};

export default grammar;

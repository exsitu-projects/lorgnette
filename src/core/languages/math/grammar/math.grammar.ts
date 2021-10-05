// Generated automatically by nearley, version 2.20.1
// http://github.com/Hardmath123/nearley
// Bypasses TS6133. Allow declared but unused functions.
// @ts-ignore
function id(d: any[]): any { return d[0]; }

    // Helper function to create a node of the given type that contains
    // the key/value pairs in the dict. returned by
    // the given node properties generator + location information.
    const Node = (
        type: string,
        valueComputer: (data: any[]) => number,
        propertiesDictOrComputer: (object | ((data: any[]) => object)) = {}
    ) => {
        return (data: any[], location: number | undefined, reject: any) => {
            const otherProperties = propertiesDictOrComputer instanceof Function
                ? propertiesDictOrComputer(data)
                : propertiesDictOrComputer;

            return {
                type: type,
                location: location,
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
  Lexer: undefined,
  ParserRules: [
    {"name": "main", "symbols": ["_", "AS", "_"], "postprocess": Node("Expression", d => d[1].value)},
    {"name": "P", "symbols": [{"literal":"("}, "_", "AS", "_", {"literal":")"}], "postprocess": Node("Parentheses", d => d[2].value)},
    {"name": "P", "symbols": ["N"], "postprocess": id},
    {"name": "E", "symbols": ["P", "_", {"literal":"^"}, "_", "E"], "postprocess": Node("Exponent", d => Math.pow(d[0].value, d[4].value))},
    {"name": "E", "symbols": ["P"], "postprocess": id},
    {"name": "MD", "symbols": ["MD", "_", {"literal":"*"}, "_", "E"], "postprocess": Node("Multiplication", d => d[0].value*d[4].value)},
    {"name": "MD", "symbols": ["MD", "_", {"literal":"/"}, "_", "E"], "postprocess": Node("Division", d => d[0].value/d[4].value)},
    {"name": "MD", "symbols": ["E"], "postprocess": id},
    {"name": "AS", "symbols": ["AS", "_", {"literal":"+"}, "_", "MD"], "postprocess": Node("Addition", d => d[0].value+d[4].value)},
    {"name": "AS", "symbols": ["AS", "_", {"literal":"-"}, "_", "MD"], "postprocess": Node("Substraction", d => d[0].value-d[4].value)},
    {"name": "AS", "symbols": ["MD"], "postprocess": id},
    {"name": "N", "symbols": ["float"], "postprocess": id},
    {"name": "N$string$1", "symbols": [{"literal":"s"}, {"literal":"i"}, {"literal":"n"}], "postprocess": (d) => d.join('')},
    {"name": "N", "symbols": ["N$string$1", "_", "P"], "postprocess": Node("Function", d => Math.sin(d[2].value), { name: "sin", })},
    {"name": "N$string$2", "symbols": [{"literal":"c"}, {"literal":"o"}, {"literal":"s"}], "postprocess": (d) => d.join('')},
    {"name": "N", "symbols": ["N$string$2", "_", "P"], "postprocess": Node("Function", d => Math.cos(d[2].value), { name: "cos", })},
    {"name": "N$string$3", "symbols": [{"literal":"t"}, {"literal":"a"}, {"literal":"n"}], "postprocess": (d) => d.join('')},
    {"name": "N", "symbols": ["N$string$3", "_", "P"], "postprocess": Node("Function", d => Math.tan(d[2].value), { name: "tan", })},
    {"name": "N$string$4", "symbols": [{"literal":"a"}, {"literal":"s"}, {"literal":"i"}, {"literal":"n"}], "postprocess": (d) => d.join('')},
    {"name": "N", "symbols": ["N$string$4", "_", "P"], "postprocess": Node("Function", d => Math.asin(d[2].value), { name: "asin", })},
    {"name": "N$string$5", "symbols": [{"literal":"a"}, {"literal":"c"}, {"literal":"o"}, {"literal":"s"}], "postprocess": (d) => d.join('')},
    {"name": "N", "symbols": ["N$string$5", "_", "P"], "postprocess": Node("Function", d => Math.acos(d[2].value), { name: "acos", })},
    {"name": "N$string$6", "symbols": [{"literal":"a"}, {"literal":"t"}, {"literal":"a"}, {"literal":"n"}], "postprocess": (d) => d.join('')},
    {"name": "N", "symbols": ["N$string$6", "_", "P"], "postprocess": Node("Function", d => Math.atan(d[2].value), { name: "atan", })},
    {"name": "N$string$7", "symbols": [{"literal":"s"}, {"literal":"q"}, {"literal":"r"}, {"literal":"t"}], "postprocess": (d) => d.join('')},
    {"name": "N", "symbols": ["N$string$7", "_", "P"], "postprocess": Node("Function", d => Math.sqrt(d[2].value), { name: "sqrt", })},
    {"name": "N$string$8", "symbols": [{"literal":"l"}, {"literal":"n"}], "postprocess": (d) => d.join('')},
    {"name": "N", "symbols": ["N$string$8", "_", "P"], "postprocess": Node("Function", d => Math.log(d[2].value), { name: "ln", })},
    {"name": "N$string$9", "symbols": [{"literal":"p"}, {"literal":"i"}], "postprocess": (d) => d.join('')},
    {"name": "N", "symbols": ["N$string$9"], "postprocess": Node("Constant", d => Math.PI, { name: "pi",  })},
    {"name": "N", "symbols": [{"literal":"e"}], "postprocess": Node("Constant", d => Math.E, { name: "e",  })},
    {"name": "float", "symbols": ["int", {"literal":"."}, "int"], "postprocess": Node("Number", d => parseFloat(d[0].value + d[1] + d[2].value))},
    {"name": "float", "symbols": ["int"], "postprocess": Node("Number", d => parseInt(d[0].value))},
    {"name": "int$ebnf$1", "symbols": [/[0-9]/]},
    {"name": "int$ebnf$1", "symbols": ["int$ebnf$1", /[0-9]/], "postprocess": (d) => d[0].concat([d[1]])},
    {"name": "int", "symbols": ["int$ebnf$1"], "postprocess": id},
    {"name": "_$ebnf$1", "symbols": []},
    {"name": "_$ebnf$1", "symbols": ["_$ebnf$1", /[\s]/], "postprocess": (d) => d[0].concat([d[1]])},
    {"name": "_", "symbols": ["_$ebnf$1"], "postprocess": id}
  ],
  ParserStart: "main",
};

export default grammar;

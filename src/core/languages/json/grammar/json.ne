# Adapted from https://github.com/kach/nearley/blob/master/examples/json.ne
@preprocessor typescript

@{%
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
%}

@lexer lexer

@{%
    // Helper function to create a node of the given type that contains
    // the key/value pairs in the dict. returned by
    // the given node properties generator + location information.
    const Node = (
        type: string,
        propertiesDictOrComputer: (object | ((data: any[]) => object)) = {}
    ) => {
        return (data: any[], location: number | undefined, reject: any) => {
            const nonNullChildNodes = data.filter((parserNode: any) => parserNode && "text" in parserNode)
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
%}

json -> _ (object | array) _                {% d => d[1] %}

object ->
      "{" _ "}"                             {% Node("Object", { properties: [] }) %}
    | "{" _ pair (_ "," _ pair):* _ "}"     {% Node("Object", d => { return { properties: extractObjectProperties(d) }; }) %}

array ->
      "[" _ "]"                             {% Node("Array", { values: [] }) %}
    | "[" _ value (_ "," _ value):* _ "]"   {% Node("Array", d => { return { values: extractArrayValues(d) }; }) %}

value ->
      object                                {% d => d[0] %}
    | array                                 {% d => d[0] %}
    | number                                {% d => d[0] %}
    | string                                {% d => d[0] %}
    | "true"                                {% Node("Boolean", { value: true }) %}
    | "false"                               {% Node("Boolean", { value: false }) %}
    | "null"                                {% Node("Null") %}

number -> %number                           {% Node("Number", d => { return { value: d[0] }; }) %}

string -> %string                           {% Node("String", d => { return { value: d[0] }; }) %}

pair -> key _ ":" _ value                   {% Node("Property", d => { return extractPropertyKeyValue(d); }) %}

key -> %string                              {% Node("Key", d => { return { value: d[0] }; }) %}

_ -> null | %space                          {% id %}

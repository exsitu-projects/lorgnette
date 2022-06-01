@preprocessor typescript

@{%
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
%}

@lexer lexer

@{%
    // Helper function to create a "node" that will later be turned into an actual AST node.
    const Node = (
        type: string,
        propertiesDictOrDictBuilder: (object | ((data: any[]) => object)) = {},
        dataTransformer?: (data: any[]) => any[]
    ) => {
        return (data: any[], location: number | undefined, reject: any) => {
            data = !!dataTransformer ? dataTransformer(data) : data;

            console.info(`= Creating node type: ${type} =`)
            console.log(data)

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
%}



# ===== MACROS =====

# A list with separators between items that can be empty.
list[LIST_ELEMENT, SEPARATOR] ->
    _ $LIST_ELEMENT (_ $SEPARATOR _ $LIST_ELEMENT):* _                      {% d => extractListElements(d) %}

commaList[LIST_ELEMENT] ->
    list[$LIST_ELEMENT, ","]                                                {% id %}



# ===== PYTHON GRAMMAR =====

program -> instruction:*                                                    {% Node("Program", d => { return { instructions: d }; }, d => d[0]) %}

instruction ->
    _ expression _                                                          {% d => d[1] %}

expression ->
      number                                                                {% Node("Expression", d => { return { value: d[0] }; }) %}
    | boolean                                                               {% Node("Expression", d => { return { value: d[0] }; }) %}
    | none                                                                  {% Node("Expression", d => { return { value: d[0] }; }) %}
    | functionCall                                                          {% Node("Expression", d => { return { value: d[0] }; }) %}
    | indexedAccess                                                         {% Node("Expression", d => { return { value: d[0] }; }) %}
    | namedAccess                                                           {% Node("Expression", d => { return { value: d[0] }; }) %}
    | id                                                                    {% Node("Expression", d => { return { value: d[0] }; }) %}
    | string                                                                {% Node("Expression", d => { return { value: d[0] }; }) %}

indexableExpression ->
      number                                                                {% id %}
    | boolean                                                               {% id %}
    | functionCall                                                          {% id %}
    | indexedAccess                                                         {% id %}
    | namedAccess                                                           {% id %}
    | id                                                                    {% id %}
    | string                                                                {% id %}

callableExpression ->
      functionCall                                                          {% id %}
    | indexedAccess                                                         {% id %}
    | namedAccess                                                           {% id %}
    | id                                                                    {% id %}

namedAccess -> indexableExpression "." id                                   {% Node("NamedAccess", d => { return { expression: d[0], identifier: d[2] }; }) %}

indexedAccess -> indexableExpression "[" _ expression _ "]"                 {% Node("IndexedAccess", d => { return { expression: d[0], index: d[3] }; }) %}

functionCall -> callableExpression argumentList                             {% Node("FunctionCall", d => { return { callee: d[0], argumentList: d[1] }; }) %}

argumentList ->
     "(" commaList[positionalArgument] "," commaList[namedArgument] ")"     {% Node("ArgumentList", d => createListsOfArguments(d), d => [d[0], ...d[1], d[2], ...d[3], d[4]]) %}
    | "(" commaList[namedArgument] ")"                                      {% Node("ArgumentList", d => createListsOfArguments(d), d => [d[0], ...d[1], d[2]]) %}
    | "(" commaList[positionalArgument] ")"                                 {% Node("ArgumentList", d => createListsOfArguments(d), d => [d[0], ...d[1], d[2]]) %}
    | "(" _ ")"                                                             {% Node("ArgumentList", d => createListsOfArguments(d)) %}

positionalArgument -> expression                                            {% Node("PositionalArgument", d => { return { value: d[0] }; }) %}

namedArgument -> %identifier _ "=" _ expression                             {% Node("NamedArgument", d => { return { name: d[0], value: d[4] }; }) %}

string ->
      %singleQuoteLongString                                                {% Node("String", d => { return { delimiter: "'''", value: d[0].value }; }) %}
    | %doubleQuoteLongString                                                {% Node("String", d => { return { delimiter: "\"\"\"", value: d[0].value }; }) %}
    | %singleQuoteString                                                    {% Node("String", d => { return { delimiter: "'", value: d[0].value }; }) %}
    | %doubleQuoteString                                                    {% Node("String", d => { return { delimiter: "\"", value: d[0].value }; }) %}


number -> %number                                                           {% Node("Number", d => { return { value: d[0] }; }) %}

boolean ->
      "True"                                                                {% Node("Boolean", { value: true }) %}
    | "False"                                                               {% Node("Boolean", { value: false }) %}

none -> "None"                                                              {% Node("None") %}

id -> %identifier                                                           {% Node("Identifier", d => { return { name: d[0] }; }) %}

_ -> null | %space                                                          {% id %}

# Adapted from https://omrelli.ug/nearley-playground/
@preprocessor typescript

@{%
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
%}

@lexer lexer

@{%
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
%}

# -----------------------------------------------------------

main -> _ AS _                  {% Node("Expression", d => d[1].value) %}

# PEMDAS!
# We define each level of precedence as a nonterminal.

# Parentheses
P -> %leftPar _ AS _ %rightPar  {% Node("Parentheses", d => d[2].value) %}
    | N                         {% id %}

# Exponents
E -> P %powerOp E           {% Node("Exponent", d => Math.pow(d[0].value, d[2].value)) %}
    | P                         {% id %}

# Multiplication and division
MD -> MD _ %multOp _ E          {% Node("Multiplication", d => d[0].value * d[4].value) %}
    | MD _ %divOp _ E           {% Node("Division", d => d[0].value / d[4].value) %}
    | E                         {% id %}

# Addition and subtraction
AS -> AS _ %addOp _ MD          {% Node("Addition", d => d[0].value + d[4].value) %}
    | AS _ %subOp _ MD          {% Node("Substraction", d => d[0].value - d[4].value) %}
    | MD                        {% id %}

# A number or a function of a number
N -> number                     {% id %}
    | %funcName P               {% Node("Function", d => Math.sin(d[1].value), d => { return { name: d[0], }; }) %}
    | %constant                 {% Node("Constant", d => 0, d => { return { name: d[0], }; }) %}
    # | "cos" _ P                 {% Node("Function", d => Math.cos(d[2].value), { name: "cos", }) %}
    # | "tan" _ P                 {% Node("Function", d => Math.tan(d[2].value), { name: "tan", }) %}
    
    # | "asin" _ P                {% Node("Function", d => Math.asin(d[2].value), { name: "asin", }) %}
    # | "acos" _ P                {% Node("Function", d => Math.acos(d[2].value), { name: "acos", }) %}
    # | "atan" _ P                {% Node("Function", d => Math.atan(d[2].value), { name: "atan", }) %}
    
    # | "sqrt" _ P                {% Node("Function", d => Math.sqrt(d[2].value), { name: "sqrt", }) %}
    # | "ln" _ P                  {% Node("Function", d => Math.log(d[2].value), { name: "ln", })  %}

    # | "pi"                      {% Node("Constant", d => Math.PI, { name: "pi",  }) %}
    # | "e"                       {% Node("Constant", d => Math.E, { name: "e",  }) %}

number -> %number               {% Node("Number", d => parseFloat(d[0])) %}

# Whitespace. The important thing here is that the postprocessor
# is a null-returning function. This is a memory efficiency trick.
# _ -> %whitespace:?              {% id %}
_ -> %whitespace:?              {% Node("Whitespace", d => NaN) %}

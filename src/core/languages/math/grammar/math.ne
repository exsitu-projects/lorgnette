# Adapted from https://omrelli.ug/nearley-playground/
@preprocessor typescript

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
%}

# -----------------------------------------------------------

main -> _ AS _      {% Node("Expression", d => d[1].value) %}

# PEMDAS!
# We define each level of precedence as a nonterminal.

# Parentheses
P -> "(" _ AS _ ")" {% Node("Parentheses", d => d[2].value) %}
    | N             {% id %}

# Exponents
E -> P _ "^" _ E    {% Node("Exponent", d => Math.pow(d[0].value, d[4].value)) %}
    | P             {% id %}

# Multiplication and division
MD -> MD _ "*" _ E  {% Node("Multiplication", d => d[0].value*d[4].value) %}
    | MD _ "/" _ E  {% Node("Division", d => d[0].value/d[4].value) %}
    | E             {% id %}

# Addition and subtraction
AS -> AS _ "+" _ MD {% Node("Addition", d => d[0].value+d[4].value) %}
    | AS _ "-" _ MD {% Node("Substraction", d => d[0].value-d[4].value) %}
    | MD            {% id %}

# A number or a function of a number
N -> float          {% id %}
    | "sin" _ P     {% Node("Function", d => Math.sin(d[2].value), { name: "sin", }) %}
    | "cos" _ P     {% Node("Function", d => Math.cos(d[2].value), { name: "cos", }) %}
    | "tan" _ P     {% Node("Function", d => Math.tan(d[2].value), { name: "tan", }) %}
    
    | "asin" _ P    {% Node("Function", d => Math.asin(d[2].value), { name: "asin", }) %}
    | "acos" _ P    {% Node("Function", d => Math.acos(d[2].value), { name: "acos", }) %}
    | "atan" _ P    {% Node("Function", d => Math.atan(d[2].value), { name: "atan", }) %}
    
    | "sqrt" _ P    {% Node("Function", d => Math.sqrt(d[2].value), { name: "sqrt", }) %}
    | "ln" _ P      {% Node("Function", d => Math.log(d[2].value), { name: "ln", })  %}

    | "pi"          {% Node("Constant", d => Math.PI, { name: "pi",  }) %}
    | "e"           {% Node("Constant", d => Math.E, { name: "e",  }) %}

# I use `float` to basically mean a number with a decimal point in it
float ->
      int "." int   {% Node("Number", d => parseFloat(d[0].value + d[1] + d[2].value)) %}
    | int           {% Node("Number", d => parseInt(d[0].value)) %}

int -> [0-9]:+      {% id %}

# Whitespace. The important thing here is that the postprocessor
# is a null-returning function. This is a memory efficiency trick.
_ -> [\s]:*         {% id %}

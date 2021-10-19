type F<I, O> = (arg: I) => O;

export class ProgrammableFunction<I = any, O = any> {
    private function: F<I, O>;

    // constructor(functionBody: string);
    // constructor(functionRef: F<I, O>);
    constructor(functionBodyOrRef: string | F<I, O>) {
        this.function = typeof functionBodyOrRef === "string"
            ? this.createFunctionFromBody(functionBodyOrRef)
            : functionBodyOrRef;
    }

    private createFunctionFromBody(functionBody: string, argumentName: string = "arg"): F<I, O> {
        // eslint-disable-next-line
        return new Function("arg", functionBody) as F<I, O>;
    }
    
    call(arg: I): O {
        try {
            return this.function(arg); 
        } catch (error) {
            console.error("An error occured in a programmable function:", error);
            throw error;
        }
    }
}
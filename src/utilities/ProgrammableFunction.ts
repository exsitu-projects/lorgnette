type F<I, O> = (arg: I) => O;

export type ProgrammableFunctionOf<F extends (argument: any) => any> =
    ProgrammableFunction<
        Parameters<F>[0],
        ReturnType<F>
    >;

export type ExceptionHandler = (exception: any) => void;

const DEFAULT_EXCEPTION_HANDLER = (exception: any) => {
    console.error("An exception was caught in a programmable function:", exception);
};

export class ProgrammableFunction<I = any, O = any> {
    private function: F<I, O>;
    private exceptionHandler: ExceptionHandler;

    // constructor(functionBody: string);
    // constructor(functionRef: F<I, O>);
    constructor(
        functionBodyOrRef: string | F<I, O>,
        exceptionHandler: ExceptionHandler = DEFAULT_EXCEPTION_HANDLER
    ) {
        this.function = typeof functionBodyOrRef === "string"
            ? this.createFunctionFromBody(functionBodyOrRef)
            : functionBodyOrRef;
        this.exceptionHandler = exceptionHandler;
    }

    private createFunctionFromBody(functionBody: string, argumentName: string = "argument"): F<I, O> {
        // eslint-disable-next-line
        return new Function(argumentName, functionBody) as F<I, O>;
    }
    
    call(argument: I): O {
        try {
            return this.function(argument); 
        } catch (exception) {
            this.exceptionHandler(exception);
            throw exception;
        }
    }
}
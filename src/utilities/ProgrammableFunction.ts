export type ProgrammableFunctionException = any;

export type ProgrammableFunctionExceptionHandler = (exception: ProgrammableFunctionException) => void;

const DEFAULT_PROGRAMMABLE_FUNCTION_EXCEPTION_HANDLER = (exception: ProgrammableFunctionException) => {
    console.error("An exception was caught in a programmable function:", exception);
};

export type ProgrammableFunctionSource<I = any, O = any> =
    string | ((argument: I) => O);

export class ProgrammableFunction<I = any, O = any> {
    private function: (argument: I) => O;
    private exceptionHandler: ProgrammableFunctionExceptionHandler;

    constructor(
        source: ProgrammableFunctionSource<I, O>,
        exceptionHandler: ProgrammableFunctionExceptionHandler = DEFAULT_PROGRAMMABLE_FUNCTION_EXCEPTION_HANDLER
    ) {
        this.function = typeof source === "string"
            ? this.createFunctionFromTextualDescription(source)
            : source;
        this.exceptionHandler = exceptionHandler;
    }

    private createFunctionFromTextualDescription(
        functionBody: string,
        argumentName: string = "argument"
    ): (argument: I) => O {
        return new Function(argumentName, functionBody) as (argument: I) => O;
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

export type ProgrammableFunctionOf<F extends (argument: any) => any> =
    ProgrammableFunction<
        Parameters<F>[0],
        ReturnType<F>
    >;

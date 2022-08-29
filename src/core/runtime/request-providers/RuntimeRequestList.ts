import { Fragment } from "../../fragments/Fragment";
import { RuntimeRequest, RuntimeRequestExpression } from "../RuntimeRequest";
import { RuntimeRequestContext, RuntimeRequestProvider } from "./RuntimeRequestProvider";

export type NamedExpression = {
    name: string,
    expression: RuntimeRequestExpression
};

export class RuntimeRequestList implements RuntimeRequestProvider {
    readonly namesToRuntimeExpressions: Map<string, RuntimeRequestExpression>;

    constructor(
        namedExpressions: Record<string, RuntimeRequestExpression> = {}
    ) {
        this.namesToRuntimeExpressions = new Map();
        this.add(namedExpressions);
    }

    add(name: string, expression: RuntimeRequestExpression): void;
    add(namedExpressions: Record<string, RuntimeRequestExpression>): void;
    add(nameOrNamedExpressions: string | Record<string, RuntimeRequestExpression>, expression?: RuntimeRequestExpression): void {
        if (arguments.length === 1) {
            const name = nameOrNamedExpressions as string;
            this.namesToRuntimeExpressions.set(name, expression!);
        }
        else {
            const namedExpressions = nameOrNamedExpressions as Record<string, RuntimeRequestExpression>;
            for (let name of Object.getOwnPropertyNames(namedExpressions)) {
                this.add(name, namedExpressions[name]);
            }
        }
        
    }

    provideRuntimeRequests(context: RuntimeRequestContext<Fragment>): RuntimeRequest[] {
        return [...this.namesToRuntimeExpressions.entries()]
            .map(([name, expression]: [string, RuntimeRequestExpression]) =>
                RuntimeRequest.createForFragment(context.fragment, name, expression)
            );
    }
}

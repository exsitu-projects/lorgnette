import { RuntimeRequestId } from "./RuntimeRequest";

export interface RawRuntimeResponse {
    readonly requestId: number;
    readonly content: string;    
}

export class RuntimeResponse {
    private requestId: RuntimeRequestId;
    readonly name: string;
    readonly receptionTime: number;
    readonly content: string;

    constructor(
        requestId: RuntimeRequestId,
        name: string,
        receptionTime: number,
        content: string
    ) {
        this.requestId = requestId;
        this.name = name;
        this.receptionTime = receptionTime;
        this.content = content;
    }

    static fromRawResponse(
        rawResponse: RawRuntimeResponse,
        name: string,
        receptionTime: number
    ): RuntimeResponse {
        return new RuntimeResponse(
            rawResponse.requestId,
            name,
            receptionTime,
            rawResponse.content
        );
    }
}

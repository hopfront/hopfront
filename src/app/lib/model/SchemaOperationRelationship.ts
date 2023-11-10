import {StandaloneOperation} from "@/app/lib/model/StandaloneOperation";

export interface SchemaOperationRelationship {
    operation: StandaloneOperation
    isRequestBody: boolean
    isResponseBody: boolean
}
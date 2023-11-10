import {StandaloneOperation} from "@/app/lib/model/StandaloneOperation";
import {OperationFromSchemaReason} from "@/app/lib/model/OperationFromSchemaReason";

export interface RunnableOperationFromSchema {
    operation: StandaloneOperation
    reasons: OperationFromSchemaReason[]
}
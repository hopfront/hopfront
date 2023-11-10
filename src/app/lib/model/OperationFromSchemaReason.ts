import {ParameterForeignKeyWithSource} from "@/app/lib/model/ParameterForeignKeyWithSource";
import {SchemaForeignKeyWithSource} from "@/app/lib/model/SchemaForeignKeyWithSource";
import {SchemaRefAsRequestBody} from "@/app/lib/model/SchemaRefAsRequestBody";

export interface OperationFromSchemaReason {
    parameterForeignKey?: ParameterForeignKeyWithSource
    schemaForeignKey?: SchemaForeignKeyWithSource
    schemaRefAsRequestBody?: SchemaRefAsRequestBody
}
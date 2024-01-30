import {OpenAPIV3} from "openapi-types";
export interface OpenAPIDocumentExtension {
    servers: OpenAPIV3.ServerObject[]
    schemas: SchemaExtension[]
    operations: OperationExtension[]
}

export interface SchemaExtension {
    schemaRef: string
    labelProperty?: string
    properties: PropertyExtension[]
}

export type PropertyVisibility = "everywhere" | "only-detail-views" | "only-config-views";

export interface PropertyExtension {
    propertyName: string
    label?: string
    visibility?: PropertyVisibility
    foreignKeys: ForeignKey[]
}

export interface ForeignKey {
    apiSpecId: string
    schemaRef: string
    propertyName: string
}

export interface OperationExtension {
    operationId: string
    parameters: ParameterExtension[]
}

export interface ParameterExtension {
    parameterName: string
    foreignKeys: ForeignKey[]
}

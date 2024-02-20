import {OpenAPIV3} from "openapi-types";
import {ApiAuthenticationAccessTokenConfigData} from "@/app/lib/dto/ApiAuthenticationConfig";
export interface OpenAPIDocumentExtension {
    servers: OpenAPIV3.ServerObject[]
    schemas: SchemaExtension[]
    operations: OperationExtension[]
    securitySchemes: SecuritySchemeExtension[] | undefined // undefined is here to be backward compatible.
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

export interface SecuritySchemeExtension {
    securitySchemeKey: string
    httpBearerExtension?: HttpBearerSecuritySchemeExtension
}

export interface HttpBearerSecuritySchemeExtension {
    accessTokenConfig: ApiAuthenticationAccessTokenConfigData
}

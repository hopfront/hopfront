import {OpenAPIV3} from "openapi-types";

export interface ParameterWithValue {
    parameter: OpenAPIV3.ParameterObject
    value: string,
    readonly: boolean
}
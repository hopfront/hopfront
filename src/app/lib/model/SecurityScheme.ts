import {OpenAPIV3} from "openapi-types";
import SecuritySchemeObject = OpenAPIV3.SecuritySchemeObject;

export interface SecurityScheme {
    key: string
    object: SecuritySchemeObject
}
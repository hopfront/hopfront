import {OpenAPIV3} from "openapi-types";

export interface ApiSpec {
    id: string
    document: OpenAPIV3.Document
}
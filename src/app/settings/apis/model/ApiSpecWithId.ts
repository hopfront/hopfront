import {OpenAPIV3} from "openapi-types";

export interface ApiDocWithId {
    apiSpecId: string
    document: OpenAPIV3.Document
}
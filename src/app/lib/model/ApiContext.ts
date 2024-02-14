import { ApiSpec } from "@/app/lib/dto/ApiSpec";
import { OpenAPIDocumentExtension } from "@/app/lib/dto/OpenApiExtensions";
import { OpenAPIV3 } from "openapi-types";
import { ApiConfig } from "../dto/ApiConfig";
import ReferenceObject = OpenAPIV3.ReferenceObject;
import SchemaObject = OpenAPIV3.SchemaObject;

export interface ApiContext {
    apiSpec: ApiSpec
    extension: OpenAPIDocumentExtension | undefined
    config: ApiConfig
}

export type SchemaOrReference = SchemaObject | ReferenceObject
import { SchemaOrReference } from "@/app/lib/model/ApiContext";

export interface ResponseBodyDefinition {
    contentType: string
    schema: SchemaOrReference
}
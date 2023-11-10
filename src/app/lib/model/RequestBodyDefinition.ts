import { SchemaOrReference } from "@/app/lib/model/ApiContext";

export interface RequestBodyDefinition {
    contentType: string
    schema: SchemaOrReference
}
import {ForeignKey} from "@/app/lib/dto/OpenApiExtensions";

export interface SchemaForeignKeySource {
    apiSpecId: string
    schemaRef: string
    requestBodyContentType: string
    propertyName: string
}

export interface SchemaForeignKeyWithSource {
    source: SchemaForeignKeySource
    foreignKey: ForeignKey
}
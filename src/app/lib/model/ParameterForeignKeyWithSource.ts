import {ForeignKey} from "@/app/lib/dto/OpenApiExtensions";

export interface ParameterForeignKeySource {
    apiSpecId: string
    operationId: string
    parameterName: string
}

export interface ParameterForeignKeyWithSource {
    source: ParameterForeignKeySource
    foreignKey: ForeignKey
}
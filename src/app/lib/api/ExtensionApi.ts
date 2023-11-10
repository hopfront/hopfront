import {ForeignKey, OperationExtension, SchemaExtension} from "@/app/lib/dto/OpenApiExtensions";
import {OpenAPIV3} from "openapi-types";
import ServerObject = OpenAPIV3.ServerObject;
import {mutateApiContext} from "@/app/lib/api/utils";

const schemaIdFromSchemaRef = (schemaRef: string): string => {
    return btoa(schemaRef);
}

export class ExtensionApi {

    static async saveOperationExtension(apiSpecId: string, operationExtension: OperationExtension) {
        return fetch(`/api/api-specs/${apiSpecId}/extension/operations`, {
            method: 'PUT',
            body: JSON.stringify(operationExtension),
        }).then(() => mutateApiContext(apiSpecId));
    }

    static async saveOperationParameterForeignKey(
        apiSpecId: string,
        operationId: string,
        parameterName: string,
        foreignKey: ForeignKey) {

        return fetch(`/api/api-specs/${apiSpecId}/extension/operations/${operationId}/parameters/${parameterName}/foreign-keys`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(foreignKey),
        }).then(() => mutateApiContext(apiSpecId));
    }

    static async saveSchemaPropertyForeignKey(
        apiSpecId: string,
        schemaRef: string,
        propertyName: string,
        foreignKey: ForeignKey) {

        return fetch(`/api/api-specs/${apiSpecId}/extension/schemas/${schemaIdFromSchemaRef(schemaRef)}/properties/${propertyName}/foreign-keys`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(foreignKey),
        }).then(() => mutateApiContext(apiSpecId));
    }

    static async updateExtensionServers(apiSpecId: string, updated: ServerObject[]) {
        fetch(`/api/api-specs/${apiSpecId}/extension/servers`, {
            method: 'PUT',
            body: JSON.stringify(updated),
        })
            .then(() => mutateApiContext(apiSpecId))
            .catch(reason => console.log(`Failed to save servers for api spec with id=${apiSpecId}`, reason));
    }

    static async updateExtensionSchema(apiSpecId: string, schemaExtension: SchemaExtension) {
        fetch(`/api/api-specs/${apiSpecId}/extension/schemas`, {
            method: 'POST',
            body: JSON.stringify(schemaExtension),
        })
            .then(() => mutateApiContext(apiSpecId))
            .catch(reason => console.log(`Failed to save extension schema for api spec with id=${apiSpecId}`, reason));
    }
}
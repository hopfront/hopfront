// noinspection SpellCheckingInspection

import {
    ForeignKey,
    OpenAPIDocumentExtension,
    OperationExtension,
    ParameterExtension,
    SchemaExtension
} from "@/app/lib/dto/OpenApiExtensions";
import {StandaloneOperation} from "@/app/lib/model/StandaloneOperation";
import {
    buildSchemaRef, getStandaloneOperations, schemaIsInput, schemaIsOutput
} from "@/app/lib/openapi/utils";
import {OpenAPIV3} from "openapi-types";
import NonArraySchemaObject = OpenAPIV3.NonArraySchemaObject;
import ParameterObject = OpenAPIV3.ParameterObject;
import SchemaObject = OpenAPIV3.SchemaObject;
import {OpenAPIRepository} from "@/app/api/lib/repository/OpenAPIRepository";
import {ApiSpec} from "@/app/lib/dto/ApiSpec";

// This looks dumb, but I'm not in the mood to think of anything else
const UPPERCASE_LETTERS = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];

const isMultiWordPathifiedProperty = (propertyName: string): boolean => {
    return propertyName.indexOf(".") >= 0;
}

const prefixPathifiedPropertyWithSchema = (pathifiedProperty: string, schemaName: string): string => {
    return schemaName.toLowerCase() + "." + pathifiedProperty;
}

const pathifyProperty = (propertyName: string) => {
    let newPropertyName = propertyName;

    UPPERCASE_LETTERS.forEach(uppercaseLetter =>
        newPropertyName = newPropertyName.replace(uppercaseLetter, "." + uppercaseLetter.toLowerCase()));

    return newPropertyName;
}

function findForeignKeys(propertyParentObjectName: string, propertyName: string, apiSpec: ApiSpec): ForeignKey[] {
    const foreignKeys: ForeignKey[] = [];

    // petId -> pet.id
    const pathifiedPropertyName = pathifyProperty(propertyName);

    for (const otherSchemaName in apiSpec.document.components?.schemas) {
        const otherSchemaRef = buildSchemaRef(otherSchemaName);

        if (schemaIsOutput(otherSchemaRef, apiSpec)) {
            if (otherSchemaName !== propertyParentObjectName) {
                const otherSchema = apiSpec.document.components!.schemas[otherSchemaName] as NonArraySchemaObject;
                for (const otherSchemaPropertyName in otherSchema.properties) {
                    const pathifiedOtherPropertyName = pathifyProperty(otherSchemaPropertyName);

                    const propertiesHaveSamePath = pathifiedPropertyName === pathifiedOtherPropertyName;
                    const otherPropertyWithSchemaPrefix = prefixPathifiedPropertyWithSchema(pathifiedOtherPropertyName, otherSchemaName);
                    const propertiesHaveSamePathWhenOtherHasSchemaPrefix = pathifiedPropertyName === otherPropertyWithSchemaPrefix;

                    if (propertiesHaveSamePath || propertiesHaveSamePathWhenOtherHasSchemaPrefix) {
                        if (isMultiWordPathifiedProperty(pathifiedPropertyName)) {
                            const foreignKey = {
                                apiSpecId: apiSpec.id,
                                schemaRef: buildSchemaRef(otherSchemaName),
                                propertyName: otherSchemaPropertyName,
                            };
                            console.log(`Registering foreign key: ${propertyParentObjectName}.${propertyName} --> ${JSON.stringify(foreignKey)}`)
                            foreignKeys.push(foreignKey);
                        } else {
                            // We don't do anything for properties named "id" or "name" because they are not
                            // specific enough.
                        }
                    }
                }
            }
        }
    }

    return foreignKeys;
}

export class OpenAPIExtensionService {

    static createDocumentExtension(apiSpec: ApiSpec) {
        const extension: OpenAPIDocumentExtension = {
            servers: [],
            schemas: this.createSchemaExtensions(apiSpec),
            operations: this.createOperationExtensions(apiSpec)
        };

        OpenAPIRepository.getInstance().saveExtension(apiSpec.id, extension);
    }

    static createSchemaExtensions(apiSpec: ApiSpec): SchemaExtension[] {
        const schemaExtensions: SchemaExtension[] = [];

        for (const schemaName in apiSpec.document.components?.schemas) {
            const schema = apiSpec.document.components!.schemas[schemaName] as NonArraySchemaObject

            const schemaExtension: SchemaExtension = {
                schemaRef: buildSchemaRef(schemaName),
                properties: [],
            };

            if (schemaIsInput(buildSchemaRef(schemaName), apiSpec)) {
                for (const schemaPropertyName in schema.properties) {
                    schemaExtension.properties.push({
                        propertyName: schemaPropertyName,
                        foreignKeys: findForeignKeys(schemaName, schemaPropertyName, apiSpec),
                    });
                }
            }

            schemaExtensions.push(schemaExtension);
        }

        return schemaExtensions;
    }

    static createOperationExtensions(apiSpec: ApiSpec): OperationExtension[] {
        return getStandaloneOperations(apiSpec).map((standaloneOperation: StandaloneOperation) => {
            return {
                operationId: standaloneOperation.getOperationId(),
                parameters: (standaloneOperation.operation.parameters || []).flatMap((parameter) => {
                    const parameterObject = parameter as ParameterObject;

                    if (!parameterObject.schema) {
                        return [];
                    }

                    if (parameterObject.schema.hasOwnProperty('$ref')) {
                        return [];
                    } else {
                        const schema = parameterObject.schema as SchemaObject;

                        if (schema.type === "object" || schema.type === "array") {
                            console.log(`Schema of type ${schema.type} is not handled yet for parameter foreign key`);
                            return [];
                        } else {
                            return [{
                                parameterName: parameterObject.name,
                                foreignKeys: findForeignKeys('', parameterObject.name, apiSpec)
                            } as ParameterExtension];
                        }
                    }
                }),
            } as OperationExtension
        });
    }
}
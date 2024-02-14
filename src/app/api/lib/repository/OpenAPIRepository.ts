import { OpenAPIV3 } from "openapi-types";

import {
    deleteDirectory,
    fileExists,
    listDirectoryChildren,
    readFile,
    writeFile
} from "@/app/api/lib/repository/utils";
import { ApiConfig } from "@/app/lib/dto/ApiConfig";
import {
    ForeignKey,
    OpenAPIDocumentExtension,
    OperationExtension,
    SchemaExtension
} from "@/app/lib/dto/OpenApiExtensions";
import ServerObject = OpenAPIV3.ServerObject;
import {ApiSpec} from "@/app/lib/dto/ApiSpec";

const API_SPECS_DIRECTORY = `api-specs`;
const SPEC_EXTENSION_FILE_NAME = 'extension.json';
const SPEC_SPEC_FILE_NAME = 'spec';
const SPEC_CONFIG_FILE_NAME = 'config.json';

const buildConfigDirectory = (apiSpecId: string) => {
    return `${API_SPECS_DIRECTORY}/${apiSpecId}/config`;
}

export class OpenAPIRepository {
    private static instance: OpenAPIRepository;

    public static getInstance(): OpenAPIRepository {
        if (!OpenAPIRepository.instance) {
            OpenAPIRepository.instance = new OpenAPIRepository();
        }

        return OpenAPIRepository.instance;
    }

    public saveSchemaExtension(apiSpecId: string, newSchemaExtension: SchemaExtension) {
        const existingExtension = this.getExtension(apiSpecId);

        if (!existingExtension) {
            throw new Error('Operation extension is not ready to be modified');
        }

        const updateSchemaExtensions = existingExtension.schemas
            .map(existingSchemaExtension => existingSchemaExtension.schemaRef === newSchemaExtension.schemaRef
                ? newSchemaExtension
                : existingSchemaExtension);

        this.saveExtension(apiSpecId, {
            servers: existingExtension.servers,
            schemas: updateSchemaExtensions,
            operations: existingExtension.operations,
        });
    }

    public addOperationParameterExtensionForeignKey(
        apiSpecId: string,
        operationId: string,
        parameterName: string,
        foreignKey: ForeignKey) {

        const apiExtension = this.getExtension(apiSpecId);

        if (!apiExtension) {
            throw new Error('Operation extension is not ready to be modified');
        }

        const existingOperationExtension = apiExtension.operations
            .find(operationExtension => operationExtension.operationId === operationId);

        if (existingOperationExtension) {
            const existingParameterExtension = existingOperationExtension.parameters
                .find(parameterExtension => parameterExtension.parameterName === parameterName);

            if (existingParameterExtension) {
                const existingForeignKey = existingParameterExtension.foreignKeys
                    .find(fk => fk.schemaRef === foreignKey.schemaRef && fk.propertyName === foreignKey.propertyName);

                if (existingForeignKey) {
                    // we do nothing, the foreign key already exist.
                } else {
                    existingParameterExtension.foreignKeys.push(foreignKey);
                    this.saveExtension(apiSpecId, apiExtension);
                }
            } else {
                existingOperationExtension.parameters.push({
                    parameterName: parameterName,
                    foreignKeys: [foreignKey],
                });
                this.saveExtension(apiSpecId, apiExtension);
            }
        } else {
            apiExtension.operations.push({
                operationId: operationId,
                parameters: [{
                    parameterName: parameterName,
                    foreignKeys: [foreignKey],
                }]
            });
            this.saveExtension(apiSpecId, apiExtension);
        }
    }


    public addSchemaPropertyExtensionForeignKey(
        apiSpecId: string,
        schemaRef: string,
        propertyName: string,
        foreignKey: ForeignKey) {

        const apiExtension = this.getExtension(apiSpecId);

        if (!apiExtension) {
            throw new Error('Operation extension is not ready to be modified');
        }

        const existingSchemaExtension = apiExtension.schemas.find(schemaExtension => schemaExtension.schemaRef === schemaRef);

        if (existingSchemaExtension) {
            const existingPropertyExtension = existingSchemaExtension.properties.find(propertyExtension => propertyExtension.propertyName === propertyName);

            if (existingPropertyExtension) {
                const existingForeignKey = existingPropertyExtension.foreignKeys
                    .find(fk => fk.schemaRef === foreignKey.schemaRef && fk.propertyName === foreignKey.propertyName);

                if (existingForeignKey) {
                    // we do nothing, the foreign key already exist.
                } else {
                    existingPropertyExtension.foreignKeys.push(foreignKey);
                    this.saveExtension(apiSpecId, apiExtension);
                }
            } else {
                existingSchemaExtension.properties.push({
                    propertyName: propertyName,
                    foreignKeys: [foreignKey],
                });
                this.saveExtension(apiSpecId, apiExtension);
            }
        } else {
            apiExtension.schemas.push({
                schemaRef: schemaRef,
                properties: [{
                    propertyName: propertyName,
                    foreignKeys: [foreignKey],
                }]
            });
            this.saveExtension(apiSpecId, apiExtension);
        }
    }

    saveOperationExtension(apiSpecId: string, newOperationExtension: OperationExtension) {
        const existingExtension = this.getExtension(apiSpecId);

        if (!existingExtension) {
            throw new Error('Operation extension is not ready to be modified');
        }

        const updatedOperationExtensions = existingExtension.operations
            .map(operation => operation.operationId === newOperationExtension.operationId
                ? newOperationExtension
                : operation);

        this.saveExtension(apiSpecId, {
            servers: existingExtension.servers,
            schemas: existingExtension.schemas,
            operations: updatedOperationExtensions,
        });
    }

    saveServersExtension(apiSpecId: string, servers: ServerObject[]) {
        const existingExtension = this.getExtension(apiSpecId);

        if (!existingExtension) {
            throw new Error('Operation extension is not ready to be modified');
        }

        this.saveExtension(apiSpecId, {
            servers: servers,
            schemas: existingExtension.schemas,
            operations: existingExtension.operations
        });
    }

    public saveExtension(id: string, extension: OpenAPIDocumentExtension) {
        writeFile(`${API_SPECS_DIRECTORY}/${id}`, SPEC_EXTENSION_FILE_NAME, JSON.stringify(extension));
    }

    public getExtension(id: string): OpenAPIDocumentExtension | undefined {
        try {
            const fileContentBuffer = readFile(`${API_SPECS_DIRECTORY}/${id}`, SPEC_EXTENSION_FILE_NAME);
            return JSON.parse(fileContentBuffer.toString());
        } catch (error: any) {
            console.log(`Failed to get extension for api spec with id=${id}`, error);
            return undefined;
        }
    }

    public saveApiSpec(id: string, text: string) {
        writeFile(`${API_SPECS_DIRECTORY}/${id}`, SPEC_SPEC_FILE_NAME, text);
    }

    public deleteApiSpec(id: string) {
        // Delete both spec and extension
        deleteDirectory(`${API_SPECS_DIRECTORY}/${id}`);
    }

    public getDocumentSpec(id: string): string | undefined {
        return readFile(`${API_SPECS_DIRECTORY}/${id}`, SPEC_SPEC_FILE_NAME);
    }

    public getApiSpecs(): ApiSpec[] {
        try {
            const apiSpecIdsAsDirectoryNames: string[] = listDirectoryChildren(API_SPECS_DIRECTORY)

            return apiSpecIdsAsDirectoryNames.map(apiSpecId => {
                const apiSpecString = readFile(`${API_SPECS_DIRECTORY}/${apiSpecId}`, SPEC_SPEC_FILE_NAME);
                const document: OpenAPIV3.Document = JSON.parse(apiSpecString);
                return {
                    id: apiSpecId,
                    document: document,
                }
            })
        } catch (error: any) {
            console.log('Failed to retrieve OpenAPI documents, defaulting to none', error);
            return [];
        }
    }

    public saveApiConfig(id: string, config: ApiConfig) {
        const existingConfig = this.getApiConfig(id);
        
        if (existingConfig) {
            config = {
                ...existingConfig,
                ...config,
            };
        }

        writeFile(buildConfigDirectory(id), SPEC_CONFIG_FILE_NAME, JSON.stringify(config));
    }

    public getApiConfig(id: string): ApiConfig {
        if (fileExists(buildConfigDirectory(id), SPEC_CONFIG_FILE_NAME)) {
            const apiConfigString = readFile(`${API_SPECS_DIRECTORY}/${id}/config`, SPEC_CONFIG_FILE_NAME);
            return JSON.parse(apiConfigString);
        } else {
            return {
                authenticationConfig: undefined,
                isCorsByPassed: false
            };
        }
    }
}

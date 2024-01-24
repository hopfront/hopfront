import { SchemaProperty } from "@/app/components/foreign-keys/SchemaPropertyPicker/SchemaPropertyPicker";
import { ApiSpec } from "@/app/lib/dto/ApiSpec";
import { ApiContext, SchemaOrReference } from "@/app/lib/model/ApiContext";
import { OperationFromSchemaReason } from "@/app/lib/model/OperationFromSchemaReason";
import { OperationInputs } from "@/app/lib/model/OperationInputs";
import { ParameterForeignKeyWithSource } from "@/app/lib/model/ParameterForeignKeyWithSource";
import { ParameterWithValue } from "@/app/lib/model/ParameterWithValue";
import { RequestBodyDefinition } from "@/app/lib/model/RequestBodyDefinition";
import { ResponseBodyDefinition } from "@/app/lib/model/ResponseBodyDefinition";
import { RunnableOperationFromSchema } from "@/app/lib/model/RunnableOperationFromSchema";
import { SchemaForeignKeySource } from "@/app/lib/model/SchemaForeignKeyWithSource";
import { SecurityScheme } from "@/app/lib/model/SecurityScheme";
import { StandaloneOperation } from "@/app/lib/model/StandaloneOperation";
import { ListItemButtonPropsColorOverrides } from "@mui/joy/ListItemButton/ListItemButtonProps";
import { ColorPaletteProp } from "@mui/joy/styles/types";
import { OverridableStringUnion } from "@mui/types";
import { OpenAPIV3 } from "openapi-types";
import OperationObject = OpenAPIV3.OperationObject;
import PathsObject = OpenAPIV3.PathsObject;
import PathItemObject = OpenAPIV3.PathItemObject;
import SchemaObject = OpenAPIV3.SchemaObject;
import RequestBodyObject = OpenAPIV3.RequestBodyObject;
import ReferenceObject = OpenAPIV3.ReferenceObject;
import NonArraySchemaObject = OpenAPIV3.NonArraySchemaObject;
import ServerObject = OpenAPIV3.ServerObject;
import ParameterObject = OpenAPIV3.ParameterObject;
import BaseSchemaObject = OpenAPIV3.BaseSchemaObject;
import ResponseObject = OpenAPIV3.ResponseObject;
import ArraySchemaObject = OpenAPIV3.ArraySchemaObject;
import MediaTypeObject = OpenAPIV3.MediaTypeObject;
import ArraySchemaObjectType = OpenAPIV3.ArraySchemaObjectType;
import NonArraySchemaObjectType = OpenAPIV3.NonArraySchemaObjectType;
import HttpMethods = OpenAPIV3.HttpMethods;
import SecuritySchemeObject = OpenAPIV3.SecuritySchemeObject;

export const randomInternalId = (length: number) => {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
        counter += 1;
    }
    return result;
}

export const resolveApiBaseUrl = (server: ServerObject): string | undefined => {
    if (!server) {
        return;
    }

    let url = server.url;

    if (url.includes('sendgrid')) {
        return 'https://api.sendgrid.com/v3';
    }

    for (let variableName in server.variables) {
        const variable = server.variables[variableName];
        url = url.replace(`{${variableName}}`, variable.default)
    }

    return url;
}

export const getMediaType = (openAPIResponseObject: OpenAPIV3.ResponseObject | undefined, contentType: string): MediaTypeObject | undefined => {
    const supportedContentTypes = ['application/json', 'application/xml', 'text/plain'];
    const supportedContentType = supportedContentTypes.find((type) => contentType.includes(type)) ?? contentType;

    if (!openAPIResponseObject?.content) {
        return undefined;
    }

    if (openAPIResponseObject.content[supportedContentType]) {
        return openAPIResponseObject.content[supportedContentType];
    } else {
        return openAPIResponseObject.content["*/*"];
    }
}

export const getApiServers = (document: OpenAPIV3.Document): OpenAPIV3.ServerObject[] => {
    if (!document.servers) {
        return [];
    }

    return document.servers;
}

const operationFromPathItemObject = (
    path: string,
    httpMethod: HttpMethods,
    operationObject: OperationObject,
    apiSpec: ApiSpec): StandaloneOperation => {

    return new StandaloneOperation(apiSpec, path, httpMethod, operationObject);
}

export const parseOperations = (pathsObject: OpenAPIV3.PathsObject, apiSpec: ApiSpec): StandaloneOperation[] => {
    const operations = [];

    for (const path in pathsObject) {
        const pathObject = pathsObject[path]!;

        if (pathObject.get) {
            const pathItemObject = pathObject.get as OperationObject;
            operations.push(operationFromPathItemObject(path, HttpMethods.GET, pathItemObject, apiSpec));
        }

        if (pathObject.put) {
            const pathItemObject = pathObject.put as OperationObject;
            operations.push(operationFromPathItemObject(path, HttpMethods.PUT, pathItemObject, apiSpec));
        }

        if (pathObject.post) {
            const pathItemObject = pathObject.post as OperationObject;
            operations.push(operationFromPathItemObject(path, HttpMethods.POST, pathItemObject, apiSpec));
        }

        if (pathObject.delete) {
            const pathItemObject = pathObject.delete as OperationObject;
            operations.push(operationFromPathItemObject(path, HttpMethods.DELETE, pathItemObject, apiSpec));
        }
    }

    return operations;
}

export const getStandaloneOperations = (apiSpec: ApiSpec): StandaloneOperation[] => {
    if (!apiSpec || !apiSpec.document) {
        console.log('This should never happen, but hey TypeScript babe.');
        return [];
    }

    const pathsObject = apiSpec.document.paths as PathsObject;
    const operations: StandaloneOperation[] = [];

    for (const path in pathsObject) {
        const pathObject = pathsObject[path]! as PathItemObject;

        for (let method of Object.values(HttpMethods)) {
            // @ts-ignore
            const operation = pathObject[method] as OperationObject;

            if (operation) {
                operations.push(new StandaloneOperation(
                    apiSpec,
                    path,
                    method,
                    operation));
            }
        }
    }

    return operations.sort((a, b) => a.path.localeCompare(b.path));
}

export const getStandaloneOperation = (operationId: string, apiSpec: ApiSpec): StandaloneOperation | undefined => {
    return getStandaloneOperations(apiSpec).find(o => o.getOperationId() === operationId);
}

const getOperationFromSchemaReasonsFromSchema = (operation: OperationObject, schemaRef: string, apiContext: ApiContext): OperationFromSchemaReason[] => {
    const operationRequestBodyDefinitions = getRequestBodyDefinitions(operation);

    return operationRequestBodyDefinitions.flatMap(requestBodyDefinition => {
        const operationRequestBodySchemaReference =
            getReferenceObjectOrUndefined(requestBodyDefinition.schema);

        if (operationRequestBodySchemaReference) {
            if (operationRequestBodySchemaReference.$ref === schemaRef) {
                return [{
                    schemaRefAsRequestBody: {
                        schemaRef: schemaRef,
                        contentType: requestBodyDefinition.contentType
                    }
                } as OperationFromSchemaReason];
            } else {
                return apiContext.extension.schemas
                    .filter(schemaExtension => schemaExtension.schemaRef === operationRequestBodySchemaReference.$ref)
                    .flatMap(schemaExtension => {
                        return schemaExtension.properties.flatMap(propertyExtension => {
                            return propertyExtension.foreignKeys
                                .flatMap(foreignKey => {
                                    if (foreignKey.schemaRef === schemaRef) {
                                        return [{
                                            schemaForeignKey: {
                                                source: {
                                                    apiSpecId: apiContext.apiSpec.id,
                                                    schemaRef: schemaExtension.schemaRef,
                                                    requestBodyContentType: requestBodyDefinition.contentType,
                                                    propertyName: propertyExtension.propertyName
                                                } as SchemaForeignKeySource,
                                                foreignKey: foreignKey,
                                            }
                                        } as OperationFromSchemaReason];
                                    } else {
                                        return [];
                                    }
                                });
                        })
                    });
            }
        } else {
            return [];
        }
    });
}

export const findRunnableOperationsFromSchema = (schemaRef: string, apiContext: ApiContext): RunnableOperationFromSchema[] => {
    if (!schemaRef) {
        return [];
    }

    return getStandaloneOperations(apiContext.apiSpec)
        .flatMap(operation => {
            const operationExtensions = apiContext.extension.operations.filter(
                operationExtension => operationExtension.operationId === operation.getOperationId());

            const parameterForeignKeys = operationExtensions
                .flatMap(o => {
                    return o.parameters.flatMap(parameter => parameter.foreignKeys
                        .flatMap(foreignKey => {
                            if (foreignKey.schemaRef === schemaRef) {
                                return [{
                                    source: {
                                        apiSpecId: apiContext.apiSpec.id,
                                        operationId: o.operationId,
                                        parameterName: parameter.parameterName,
                                    },
                                    foreignKey: foreignKey,
                                } as ParameterForeignKeyWithSource];
                            } else {
                                return [];
                            }
                        }));
                })

            const parameterForeignKeyReasons = parameterForeignKeys.map(parameterForeignKey => {
                return {
                    parameterForeignKey: parameterForeignKey
                } as OperationFromSchemaReason
            });

            const operationFromSchemaReasonsFromSchema =
                getOperationFromSchemaReasonsFromSchema(operation.operation, schemaRef, apiContext);

            const allReasons = [...parameterForeignKeyReasons, ...operationFromSchemaReasonsFromSchema];

            if (allReasons.length > 0) {
                return [{
                    operation: operation,
                    reasons: allReasons,
                } as RunnableOperationFromSchema];
            } else {
                return [];
            }

        });
}

export const getResponseBodyDefinitions = (operation: OperationObject): ResponseBodyDefinition[] => {
    if (!operation.responses) {
        return [];
    }

    const responseBodyDefinitions: ResponseBodyDefinition[] = [];

    for (const responseCode in operation.responses) {
        const response = operation.responses[responseCode] as ResponseObject;

        if (response.content) {
            for (const contentType in response.content) {
                const responseMediaType = response.content[contentType];

                if (responseMediaType.schema) {
                    responseBodyDefinitions.push({
                        contentType: contentType,
                        schema: responseMediaType.schema,
                    });
                }
            }
        }
    }

    return responseBodyDefinitions;
}

export const getRequestBodyDefinitions = (operation: OperationObject): RequestBodyDefinition[] => {
    if (!operation.requestBody) {
        return [];
    }

    const requestBody = operation.requestBody as RequestBodyObject;

    const requestBodyDefinitions: RequestBodyDefinition[] = [];

    for (let contentType in requestBody.content) {
        const requestBodyContent = requestBody.content[contentType];

        if (requestBodyContent && requestBodyContent.schema) {
            requestBodyDefinitions.push({
                contentType: contentType,
                schema: requestBodyContent.schema,
            });
        }
    }

    return requestBodyDefinitions;
}

export const getReferenceObjectOrUndefined = (schema: SchemaOrReference): OpenAPIV3.ReferenceObject | undefined => {
    if (schema && schema.hasOwnProperty("$ref")) {
        return schema as ReferenceObject;
    } else {
        return undefined;
    }
}

export const resolveSchemaFromSchemaOrReference = (schemaOrReference: SchemaOrReference, document: OpenAPIV3.Document): OpenAPIV3.SchemaObject => {
    const reference = getReferenceObjectOrUndefined(schemaOrReference);

    if (reference) {
        return getSchemaByRef(reference, document);
    } else {
        return schemaOrReference as NonArraySchemaObject;
    }
}

export const uniqueFilter = (value: string, index: number, array: string[]) => array.indexOf(value) === index;

export const buildSchemaRef = (schemaName: string): string => {
    return `#/components/schemas/${schemaName}`;
}

export const getHopFrontVersion = (): string => {
    return process.env.NEXT_PUBLIC_APP_VERSION || 'snapshot';
}

export const getSchemaPropertySchemaRef = (schemaProperty: SchemaProperty, apiSpec: ApiSpec): string | undefined => {
    const propertyParentSchemaObject = getSchemaByRef(schemaProperty.schemaRef, apiSpec.document);
    const propertySchema = propertyParentSchemaObject.properties && propertyParentSchemaObject.properties[schemaProperty.propertyName];

    if (propertySchema && propertySchema.hasOwnProperty("$ref")) {
        const propertySchemaReferenceObject = propertySchema as ReferenceObject;
        return propertySchemaReferenceObject.$ref;
    } else {
        const propertySchemaObject = propertySchema as SchemaObject;

        if (propertySchemaObject.type === "array") {
            if (propertySchemaObject.items.hasOwnProperty("$ref")) {
                const arrayItemsSchemaReferenceObject = propertySchemaObject.items as ReferenceObject;
                return arrayItemsSchemaReferenceObject.$ref;
            }
        } else {
            return undefined;
        }
    }
}

export const getSchemaPropertyType = (schemaProperty: SchemaProperty, apiSpec: ApiSpec): ArraySchemaObjectType | NonArraySchemaObjectType | undefined => {
    const propertyParentSchemaObject = getSchemaByRef(schemaProperty.schemaRef, apiSpec.document);
    const propertySchema = propertyParentSchemaObject.properties && propertyParentSchemaObject.properties[schemaProperty.propertyName];
    const propertySchemaObject = propertySchema && resolveSchemaFromSchemaOrReference(propertySchema, apiSpec.document);
    return propertySchemaObject?.type;
}

export const getSchemaByRef = (schemaRef: string | ReferenceObject, document: OpenAPIV3.Document): OpenAPIV3.SchemaObject => {
    if (!document.components) {
        throw new Error('OpenAPI document does not contain any component');
    }

    const schemas = document.components.schemas;

    if (!schemas) {
        throw new Error('OpenAPI document does not contain any schema');
    }

    if (typeof schemaRef === "string") {
        const schemaRefParts = schemaRef.split('/');
        const schemaName = schemaRefParts[schemaRefParts.length - 1];
        const schemaByName = schemas[schemaName];

        if (!schemaByName) {
            throw new Error(`Couldn't find schema with name=${schemaName} within schemas=${JSON.stringify(schemas)}`)
        }

        if (schemaByName.hasOwnProperty("$ref")) {
            throw new Error("It looks like a ref of a ref?");
        } else {
            return schemaByName as SchemaObject;
        }
    } else {
        const referenceObject = schemaRef as ReferenceObject;
        return getSchemaByRef(referenceObject.$ref, document);
    }
}

export const getPropertiesFromSchema = (schema: SchemaObject, document: OpenAPIV3.Document): Record<string, SchemaOrReference> | undefined => {
    if (!schema.properties || !schema.properties['$ref']) {
        return schema.properties;
    }

    const extraPropertiesRef = schema.properties['$ref']?.toString();
    const segments = extraPropertiesRef ? extraPropertiesRef.split('/') : [];

    if (!segments.includes('properties')) {
        return schema.properties;
    }

    segments.pop(); // to get the schema name only

    const extraProperties = getSchemaByRef(segments.join('/'), document)['properties'];
    const { '$ref': _, ...restProperties } = schema.properties; // remove not useful anymore $ref property

    return {
        ...restProperties,
        ...extraProperties,
    }
}

export const getObjectPropertyNames = (object: any): string[] => {
    if (!object) {
        return [];
    }

    return Object.entries(object).map(entry => entry[0]);
}

export const getObjectHumanLabelValue = (object: any): string | undefined => {
    return ["label", "name", "title", "username", "lastName", "firstName", "email"]
        .find(p => getObjectPropertyNames(object)
            .find(propertyName => propertyName.toLowerCase() === p));
}

export const getOperationDefaultInputs = (
    operation: StandaloneOperation | undefined,
    defaultInputs: OperationInputs | undefined): OperationInputs => {

    const body = getInitialBody(defaultInputs);

    const params = (operation)
        ? getInitialParametersWithValues(operation, (defaultInputs?.parameters || []))
        : []

    // fallback when OpenAPI spec does not specify path parameters
    const names = params.map(p => p.parameter.name);
    const pathParamsRegex = /{([^}]+)}/g;
    const matchIterator = operation?.path.matchAll(pathParamsRegex);
    const pathParams = matchIterator ? Array.from(matchIterator, m => m[1]) : [];
    const remainingParams = pathParams.filter(p => !names.includes(p));
    const extraParams = remainingParams.map(p => {
        return {
            parameter: {
                name: p,
                in: "path",
                schema: {
                    type: "string"
                }
            },
            value: "",
            readonly: false
        } as ParameterWithValue
    });

    return {
        body: body,
        parameters: params.concat(extraParams)
    };
}

const getInitialBody = (defaultInputs: OperationInputs | undefined) => {
    return defaultInputs?.body;
}

const getInitialParametersWithValues = (
    operation: StandaloneOperation, defaultParameters: ParameterWithValue[]): ParameterWithValue[] => {

    if (!operation.operation.parameters) {
        return [];
    }

    const initialParametersWithValues: ParameterWithValue[] = [];

    for (const parameter of operation.operation.parameters as ParameterObject[]) {

        const cachedValue = localStorage.getItem(`operation:${operation.getOperationId()}:param:${parameter.name}:cache`);

        const parameterDefault = defaultParameters.find(p => p.parameter.name === parameter.name);

        if (parameter.schema) {
            if (parameter.schema.hasOwnProperty("$ref")) {
                const resolvedSchema = resolveSchemaFromSchemaOrReference(parameter.schema, operation.apiSpec.document);

                initialParametersWithValues.push({
                    parameter: parameter,
                    value: parameterDefault?.value || cachedValue || resolvedSchema.default,
                    readonly: parameterDefault?.readonly || false
                });
            } else {
                initialParametersWithValues.push({
                    parameter: parameter,
                    value: parameterDefault?.value || cachedValue || (parameter.schema as BaseSchemaObject).default,
                    readonly: parameterDefault?.readonly || false
                } as ParameterWithValue);
            }
        }
    }

    return initialParametersWithValues;
}

export const getOperationButtonColor = (operation: StandaloneOperation): OverridableStringUnion<ColorPaletteProp, ListItemButtonPropsColorOverrides> | undefined => {
    switch (operation.method) {
        case "delete":
            return "danger";
        default:
            return undefined;
    }
}

export const schemaRefToHumanLabel = (schemaRef: string): string => {
    return schemaRef.replace('#/components/schemas/', '');
}

export const schemaIsInput = (schemaRef: string, apiSpec: ApiSpec): boolean => {
    const operations = getStandaloneOperations(apiSpec);

    const requestBodySchemaRefs = operations
        .flatMap(operation => getRequestBodyDefinitions(operation.operation))
        .flatMap(rbd => rbd.schema.hasOwnProperty("$ref") ? [(rbd.schema as ReferenceObject).$ref] : [])
        .filter(uniqueFilter);

    if (requestBodySchemaRefs.indexOf(schemaRef) >= 0) {
        return true;
    }

    const requestBodyContainingSchema = requestBodySchemaRefs
        .find(requestBodySchemaRef => schemaIsChildOfOtherSchema(schemaRef, requestBodySchemaRef, apiSpec));

    return !!requestBodyContainingSchema;
}

export const schemaIsOutput = (schemaRef: string, apiSpec: ApiSpec): boolean => {
    const operations = getStandaloneOperations(apiSpec);

    const responseBodySchemaRefs = operations
        .flatMap(operation => getResponseBodyDefinitions(operation.operation))
        .flatMap(rbd => rbd.schema.hasOwnProperty("$ref") ? [(rbd.schema as ReferenceObject).$ref] : [])
        .filter(uniqueFilter);

    if (responseBodySchemaRefs.indexOf(schemaRef) >= 0) {
        return true;
    }

    const responseBodyContainingSchema = responseBodySchemaRefs
        .find(responseBodySchemaRef => schemaIsChildOfOtherSchema(schemaRef, responseBodySchemaRef, apiSpec));

    return !!responseBodyContainingSchema;
}

const schemaIsChildOfOtherSchema = (schemaRef: string, otherSchemaRef: string, apiSpec: ApiSpec): boolean => {
    if (schemaRef === otherSchemaRef) {
        return true;
    }

    const otherSchema = getSchemaByRef(otherSchemaRef, apiSpec.document);

    switch (otherSchema.type) {
        case "array": {
            const arrayItemsSchemaRef = getReferenceObjectOrUndefined((otherSchema as ArraySchemaObject).items);

            if (arrayItemsSchemaRef) {
                return schemaIsChildOfOtherSchema(schemaRef, arrayItemsSchemaRef.$ref, apiSpec);
            } else {
                return false;
            }
        }
        case "object": {
            if (otherSchema.properties) {
                for (const propertyName in otherSchema.properties) {
                    const propertySchema = otherSchema.properties[propertyName];

                    if (propertySchema.hasOwnProperty("$ref")) {
                        const otherSchemaPropertySchemaRef = (propertySchema as ReferenceObject).$ref;

                        if ((otherSchemaPropertySchemaRef !== otherSchemaRef) && schemaIsChildOfOtherSchema(schemaRef, otherSchemaPropertySchemaRef, apiSpec)) {
                            return true;
                        }
                    } else {
                        const propertySchemaObject = propertySchema as SchemaObject;

                        if (propertySchemaObject.type === "array") {
                            if (propertySchemaObject.items.hasOwnProperty("$ref")) {
                                const otherSchemaPropertySchemaRef = (propertySchemaObject.items as ReferenceObject).$ref;

                                if ((otherSchemaPropertySchemaRef !== otherSchemaRef) && schemaIsChildOfOtherSchema(schemaRef, otherSchemaPropertySchemaRef, apiSpec)) {
                                    return true;
                                }
                            }
                        }
                    }
                }

                return false;
            } else {
                return false;
            }
        }
        default:
            return false;
    }
}

export const getSecurityScheme = (operation: StandaloneOperation): SecurityScheme | undefined => {
    const operationSecurityRequirements = operation.operation.security || [];

    const securitySchemes = (operation.apiSpec.document.components?.securitySchemes || {});

    if (operationSecurityRequirements.length <= 0) {
        return undefined;
    }

    // For simplicity (at the moment), we only handle the first security requirement.
    const securityRequirementObject = operationSecurityRequirements[0];

    const securityRequirementSchemeKeys = Object.keys(securityRequirementObject);

    // For simplicity (at the moment), we only handle the first item of the security requirement.
    const securityRequirementSchemeKey = securityRequirementSchemeKeys[0];

    return {
        key: securityRequirementSchemeKey,
        object: securitySchemes[securityRequirementSchemeKey] as SecuritySchemeObject
    };
}
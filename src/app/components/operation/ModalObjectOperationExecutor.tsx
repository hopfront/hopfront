import {ApiContext, SchemaOrReference} from "@/app/lib/model/ApiContext";
import {getReferenceObjectOrUndefined, getRequestBodyDefinitions} from "@/app/lib/openapi/utils";
import {ApiOperationWidget} from "@/app/components/operation/ApiOperationWidget";
import React from "react";
import {ResponsiveModal} from "../modal/ResponsiveModal";
import {ParameterWithValue} from "@/app/lib/model/ParameterWithValue";
import {OpenAPIV3} from "openapi-types";
import ParameterObject = OpenAPIV3.ParameterObject;
import {OperationInputs} from "@/app/lib/model/OperationInputs";
import {StandaloneOperation} from "@/app/lib/model/StandaloneOperation";
import {OperationBody} from "@/app/lib/model/OperationBody";

export interface ModalObjectOperationExecutorProps {
    open: boolean
    onCancel: (reason: string) => void
    object: any
    objectSchema: SchemaOrReference
    operation: StandaloneOperation
    onOperationExecuted?: () => void
    apiContext: ApiContext
}

export const ModalObjectOperationExecutor = ({
                                                 open,
                                                 onCancel,
                                                 object,
                                                 objectSchema,
                                                 operation,
                                                 onOperationExecuted,
                                                 apiContext
                                             }: ModalObjectOperationExecutorProps) => {

    const operationExtension = (apiContext.extension?.operations || []).find(op =>
        op.operationId === operation.getOperationId());

    const schemaReference = getReferenceObjectOrUndefined(objectSchema);

    const defaultParameters = (): ParameterWithValue[] => {
        return (operationExtension?.parameters || []).flatMap(parameterExtension => {
            return parameterExtension.foreignKeys
                .filter(operationParameterForeignKey => operationParameterForeignKey.schemaRef === schemaReference?.$ref)
                .map(operationParameterForeignKey => {
                    const parameter = operation.operation.parameters?.find(p => {
                        const param = p as ParameterObject;
                        return param.name === parameterExtension.parameterName;
                    });

                    const value = object[operationParameterForeignKey.propertyName];

                    return {
                        parameter: parameter,
                        value: value,
                        readonly: value !== undefined && value !== null
                    } as ParameterWithValue;
                });
        });
    }

    const defaultBody = (): OperationBody | undefined => {
        const requestBodyDefinitions = getRequestBodyDefinitions(operation.operation);

        if (requestBodyDefinitions.length === 0) {
            return undefined;
        }

        const jsonRequestBodyDefinition = requestBodyDefinitions.find(rbd => rbd.contentType === "application/json");

        const defaultRequestBodyDefinition = jsonRequestBodyDefinition || requestBodyDefinitions[0];

        const requestBodyMainSchemaReference =
            getReferenceObjectOrUndefined(defaultRequestBodyDefinition.schema);

        if (schemaReference?.$ref === requestBodyMainSchemaReference?.$ref) {
            return {
                content: object,
                contentType: defaultRequestBodyDefinition.contentType,
                readonlyProperties: []
            } as OperationBody;
        } else {
            const body: any = {};
            const readonlyProperties: string[] = [];

            (apiContext.extension?.schemas || [])
                .filter(schemaExtension => schemaExtension.schemaRef === schemaReference?.$ref)
                .flatMap(objectSchemaExtension => objectSchemaExtension.properties)
                .forEach(objectSchemaExtensionProperty => {
                    objectSchemaExtensionProperty.foreignKeys
                        .filter(objectPropertyForeignKey => objectPropertyForeignKey.schemaRef === requestBodyMainSchemaReference?.$ref)
                        .forEach(objectPropertyForeignKey => {
                            body[objectSchemaExtensionProperty.propertyName] = object[objectPropertyForeignKey.propertyName];
                            readonlyProperties.push(objectSchemaExtensionProperty.propertyName);
                        });
                });

            (apiContext.extension?.schemas || [])
                .filter(schemaExtension => schemaExtension.schemaRef === requestBodyMainSchemaReference?.$ref)
                .flatMap(requestBodySchemaExtension => requestBodySchemaExtension.properties)
                .forEach(requestBodySchemaExtensionProperty => {
                    requestBodySchemaExtensionProperty.foreignKeys
                        .filter(requestBodyPropertyForeignKey => requestBodyPropertyForeignKey.schemaRef === schemaReference?.$ref)
                        .forEach(requestBodyPropertyForeignKey => {
                            body[requestBodySchemaExtensionProperty.propertyName] = object[requestBodyPropertyForeignKey.propertyName];
                            readonlyProperties.push(requestBodySchemaExtensionProperty.propertyName);
                        });
                });

            return {
                content: body,
                contentType: defaultRequestBodyDefinition.contentType,
                readonlyProperties: readonlyProperties,
            };
        }
    }

    const body = defaultBody();

    const defaultInputs = ({
        body: body,
        parameters: defaultParameters()
    } as OperationInputs);

    const onCancelEvent = (_event: React.MouseEvent<HTMLButtonElement>, reason: string) => {
        if (reason === "backdropClick") {
            _event.preventDefault();
        } else {
            onCancel(reason);
        }
    }

    return (
        <ResponsiveModal open={open} onClose={onCancelEvent}>
            <ApiOperationWidget
                operation={operation}
                defaultInputs={defaultInputs}
                onResponse={response => {
                    if (response.status > 0 && response.status < 400) {
                        onOperationExecuted && onOperationExecuted();
                    }
                }}
                apiContext={apiContext}/>
        </ResponsiveModal>
    );
}
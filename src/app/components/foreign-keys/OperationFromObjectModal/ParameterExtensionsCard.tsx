import Card from "@mui/joy/Card";
import Typography from "@mui/joy/Typography";
import {Monospace} from "@/app/components/typography/Monospace";
import Table from "@mui/joy/Table";
import {OperationInputSourceSelect} from "@/app/components/select/OperationInputSourceSelect";
import React, {useState} from "react";
import {StandaloneOperation} from "@/app/lib/model/StandaloneOperation";
import {OpenAPIV3} from "openapi-types";
import ParameterObject = OpenAPIV3.ParameterObject;
import {ApiContext, SchemaOrReference} from "@/app/lib/model/ApiContext";
import {ParameterExtension} from "@/app/lib/dto/OpenApiExtensions";
import {resolveSchemaFromSchemaOrReference} from "@/app/lib/openapi/utils";

export interface ParameterExtensionsCardProps {
    operation: StandaloneOperation
    sampleObject: any
    objectSchema: SchemaOrReference
    onParameterExtensionsSelected: (parameterExtensions: ParameterExtension[]) => void
    disabled: boolean
    apiContext: ApiContext
}

export const ParameterExtensionsCard = ({operation, sampleObject, objectSchema, onParameterExtensionsSelected, disabled, apiContext}: ParameterExtensionsCardProps) => {
    const [parameterExtensions, setParameterExtensions] = useState<ParameterExtension[]>([]);

    if (!operation.operation.parameters || operation.operation.parameters.length === 0) {
        return null;
    }

    const updateParameterExtensions = (parameterExtensions: ParameterExtension[]) => {
        const newParameterExtensions = parameterExtensions.map(pe => pe);
        setParameterExtensions(newParameterExtensions);
        onParameterExtensionsSelected(newParameterExtensions);
    };

    return (
        <Card>
            <Typography level="title-sm"><Monospace>Parameters</Monospace></Typography>
            <Table sx={{
                '& thead th:nth-child(1)': {width: '20%'},
                '& thead th:nth-child(2)': {width: '10%'},
            }}>
                <thead>
                <tr>
                    <th>Name</th>
                    <th>Type</th>
                    <th>Value</th>
                </tr>
                </thead>
                {operation.operation.parameters?.map(param => {
                    const parameterObject = param as ParameterObject;
                    const parameterSchemaObject =
                        parameterObject.schema && resolveSchemaFromSchemaOrReference(parameterObject.schema, apiContext.apiSpec.document);

                    return (
                        <tr key={'param-' + parameterObject.name}>
                            <td><Monospace>{parameterObject.name}</Monospace></td>
                            <td><Monospace>{parameterObject.in}</Monospace></td>
                            <td><OperationInputSourceSelect
                                schema={objectSchema}
                                sampleObject={sampleObject}
                                inputType={parameterSchemaObject?.type}
                                disabled={disabled}
                                onSchemaPropertySelected={schemaPropertySelected => {
                                    if (!operation) {
                                        return;
                                    }

                                    const existingExtension = parameterExtensions
                                        .find(pe => pe.parameterName === parameterObject.name);

                                    if (existingExtension) {
                                        const existingForeignKey = existingExtension.foreignKeys
                                            .find(fk => fk.schemaRef === schemaPropertySelected.schemaRef && fk.propertyName === schemaPropertySelected.propertyName);

                                        if (!existingForeignKey) {
                                            existingExtension.foreignKeys.push({
                                                apiSpecId: operation.apiSpec.id,
                                                schemaRef: schemaPropertySelected.schemaRef,
                                                propertyName: schemaPropertySelected.propertyName,
                                            });

                                            updateParameterExtensions(parameterExtensions)
                                        }
                                    } else {
                                        parameterExtensions.push({
                                            parameterName: parameterObject.name,
                                            foreignKeys: [{
                                                apiSpecId: operation.apiSpec.id,
                                                schemaRef: schemaPropertySelected.schemaRef,
                                                propertyName: schemaPropertySelected.propertyName,
                                            }]
                                        });

                                        updateParameterExtensions(parameterExtensions)
                                    }
                                }}
                                onUserInputSelected={() => updateParameterExtensions(parameterExtensions.filter(pe => pe.parameterName !== parameterObject.name))}
                                apiContext={apiContext}
                            /></td>
                        </tr>
                    );
                })}
            </Table>
        </Card>
    );
}
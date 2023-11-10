import {OperationExtension, ParameterExtension} from "@/app/lib/dto/OpenApiExtensions";
import Typography from "@mui/joy/Typography";
import Table from "@mui/joy/Table";
import {ApiContext} from "@/app/lib/model/ApiContext";
import Box from "@mui/joy/Box";
import Card from "@mui/joy/Card";
import {OpenAPIV3} from "openapi-types";
import ParameterObject = OpenAPIV3.ParameterObject;
import {ForeignKeyConfigurer} from "@/app/components/foreign-keys/ForeignKeyConfigurer";
import {getStandaloneOperations} from "@/app/lib/openapi/utils";
import {FormControl} from "@mui/joy";
import {SchemaFormControlInput} from "@/app/components/input/SchemaFormControlInput";
import FormHelperText from "@mui/joy/FormHelperText";
import {Monospace} from "@/app/components/typography/Monospace";
import React from "react";
import {OperationLabel} from "@/app/components/typography/OperationLabel";
import {InfoAlert} from "@/app/components/alert/InfoAlert";

export interface OperationExtensionConfigurerProps {
    operationExtension: OperationExtension
    onOperationExtensionChange: (operationExtension: OperationExtension) => void
    readOnly: boolean
    apiContext: ApiContext
}

export const OperationExtensionConfigurer = ({
                                                 operationExtension,
                                                 onOperationExtensionChange,
                                                 readOnly,
                                                 apiContext
                                             }: OperationExtensionConfigurerProps) => {

    const operation = getStandaloneOperations(apiContext.apiSpec)
        .find(op => op.getOperationId() === operationExtension.operationId);

    if (!operation) {
        return null;
    }

    if (!operation.operation.parameters) {
        return (
            <InfoAlert title="This operation does not have any extendable parameter">
                <Typography level="body-sm">
                    You can only configure operations which have extendable parameters.
                </Typography>
            </InfoAlert>
        );
    }

    const parameters = operation.operation.parameters as ParameterObject[];

    return (
        <Card>
            <Typography level="title-lg">
                Parameters
            </Typography>
            <Table>
                <thead>
                <tr>
                    <th>Parameter</th>
                    <th>Type</th>
                    <th>Foreign Keys</th>
                </tr>
                </thead>
                <tbody>
                {parameters.map(parameter => {
                    const parameterExtension = operationExtension.parameters
                            .find(p => p.parameterName === parameter.name)
                        || {
                            parameterName: parameter.name,
                            foreignKeys: []
                        } as ParameterExtension;

                    const source = (
                        <>
                            <FormControl>
                                <FormHelperText>Operation</FormHelperText>
                                <OperationLabel operation={operation} mode="human"/>
                            </FormControl>

                            <FormControl>
                                <FormHelperText>Parameter</FormHelperText>
                                <Monospace>{parameter.name}</Monospace>
                            </FormControl>
                        </>
                    );

                    const inputWithoutForeignKeyPreview =
                        <SchemaFormControlInput
                            label={parameter.name}
                            updatableValue={{
                                value: undefined,
                                onValueUpdate: value => null
                            }}
                            apiContext={apiContext}/>;

                    return (
                        <tr key={parameter.name}>
                            <td>
                                <Typography fontFamily="monospace">{parameter.name}</Typography>
                            </td>
                            <td>
                                <Typography fontFamily="monospace">{parameter.in}</Typography>
                            </td>
                            <td>
                                {parameterExtension.foreignKeys.map((foreignKey, foreignKeyIndex) => (
                                    <Box sx={{mb: 1}} key={foreignKey.schemaRef + foreignKey.propertyName}>
                                        <ForeignKeyConfigurer
                                            source={source}
                                            inputWithoutForeignKeyPreview={inputWithoutForeignKeyPreview}
                                            foreignKey={foreignKey}
                                            onForeignKeySelected={selectedForeignKey => {
                                                parameterExtension.foreignKeys[foreignKeyIndex] = selectedForeignKey;
                                                onOperationExtensionChange(operationExtension);
                                            }}
                                            onDelete={() => {
                                                parameterExtension.foreignKeys = parameterExtension.foreignKeys
                                                    .flatMap(fk =>
                                                        fk.schemaRef === foreignKey.schemaRef && fk.propertyName === foreignKey.propertyName
                                                            ? []
                                                            : [fk]);
                                                onOperationExtensionChange(operationExtension);
                                            }}
                                            readOnly={readOnly}/>
                                    </Box>
                                ))}
                                <div>
                                    <ForeignKeyConfigurer
                                        key="add"
                                        source={source}
                                        inputWithoutForeignKeyPreview={inputWithoutForeignKeyPreview}
                                        foreignKey={undefined}
                                        onForeignKeySelected={selectedForeignKey => {
                                            parameterExtension.foreignKeys.push(selectedForeignKey);
                                            onOperationExtensionChange(operationExtension);
                                        }}
                                        onDelete={() => null}
                                        readOnly={readOnly}/>
                                </div>
                            </td>
                        </tr>
                    )
                })}
                </tbody>
            </Table>
        </Card>

    );
};
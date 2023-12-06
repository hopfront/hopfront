import { ParameterWithValue } from "@/app/lib/model/ParameterWithValue";
import { getRequestBodyDefinitions } from "@/app/lib/openapi/utils";
import { SchemaObjectArrayInput } from "@/app/components/input/SchemaObjectArrayInput";
import { OperationInputs } from "@/app/lib/model/OperationInputs";
import { Button } from "@mui/joy";
import { OpenAPIV3 } from "openapi-types";
import { FormEvent, FormEventHandler, useEffect, useMemo, useState } from "react";
import ArraySchemaObject = OpenAPIV3.ArraySchemaObject;
import { StandaloneOperation } from "@/app/lib/model/StandaloneOperation";
import { ApiContext } from "@/app/lib/model/ApiContext";
import { OperationParametersFormControlInputs } from "@/app/components/input/OperationParametersFormControlInputs";
import { SchemaFormControlInputs } from "../input/SchemaFormControlInputs";

export interface OperationInputFormProps {
    operation: StandaloneOperation
    operationInputs: OperationInputs
    submitLabel?: string
    loading: boolean
    debounceMillis?: number
    onChange: (input: OperationInputs) => void
    onSubmit?: () => void
    apiContext: ApiContext
}

export const OperationInputForm = ({
    operation,
    operationInputs,
    submitLabel = "Submit",
    loading,
    debounceMillis = 0,
    onChange,
    onSubmit,
    apiContext
}: OperationInputFormProps) => {

    const [arraySchemaObject, setArraySchemaObject] = useState<ArraySchemaObject | undefined>(undefined);

    const requestBodyDefinitions = useMemo(() => {
        return getRequestBodyDefinitions(operation.operation);
    }, [operation.operation]);

    const currentRequestBodyDefinition = useMemo(() => {
        return requestBodyDefinitions
            .find(requestBodyDefinition => requestBodyDefinition.contentType === operationInputs.body?.contentType);
    }, [requestBodyDefinitions, operationInputs.body?.contentType]);

    useEffect(() => {
        if (!operationInputs.body?.contentType && requestBodyDefinitions.length > 0) {
            onChange({
                body: {
                    content: operationInputs.body?.content,
                    contentType: requestBodyDefinitions[0].contentType,
                    readonlyProperties: operationInputs.body?.readonlyProperties || []
                },
                parameters: operationInputs.parameters
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [operationInputs.body?.contentType, requestBodyDefinitions.length]);

    useEffect(() => {
        const schema = currentRequestBodyDefinition?.schema as ArraySchemaObject
        if (schema && schema.type && schema.type === 'array') {
            setArraySchemaObject(schema);
        } else {
            setArraySchemaObject(undefined);
        }
    }, [currentRequestBodyDefinition]);

    const onParametersChanged = (newParameterWithValue: ParameterWithValue) => {
        onChange({
            body: operationInputs.body,
            parameters: (operationInputs.parameters || []).map(p => {
                if (p.parameter.name === newParameterWithValue.parameter.name) {
                    return newParameterWithValue;
                } else {
                    return p;
                }
            })
        });
    };

    const onBodyContentUpdate = (newBodyContent: any) => {
        onChange({
            body: {
                content: newBodyContent,
                contentType: operationInputs.body?.contentType || '',
                readonlyProperties: operationInputs.body?.readonlyProperties || []
            },
            parameters: operationInputs.parameters
        });
    };

    const onFormSubmit: FormEventHandler = (event: FormEvent) => {
        event.preventDefault();
        if (onSubmit) onSubmit();
        return false;
    };

    const operationExtension =
        apiContext.extension.operations.find(ext => ext.operationId === operation.getOperationId());

    return (
        <form onSubmit={event => onFormSubmit(event)}>
            <OperationParametersFormControlInputs
                operation={operation}
                parameters={operationInputs.parameters || []}
                extensions={operationExtension?.parameters || []}
                onValueChanged={onParametersChanged}
                disabled={loading}
                debounceMillis={debounceMillis}
                apiContext={apiContext} />

            {arraySchemaObject &&
                <SchemaObjectArrayInput
                    sx={{ mb: 2 }}
                    arrayUpdatableValue={{
                        value: operationInputs.body?.content,
                        onValueUpdate: onBodyContentUpdate
                    }}
                    arraySchema={arraySchemaObject}
                    apiContext={apiContext}
                />}

            {!arraySchemaObject && currentRequestBodyDefinition &&
                <SchemaFormControlInputs
                    inputsUpdatableValue={{
                        value: operationInputs.body?.content,
                        onValueUpdate: value => onBodyContentUpdate(value)
                    }}
                    schema={currentRequestBodyDefinition.schema}
                    readonlyProperties={operationInputs.body?.readonlyProperties}
                    apiContext={apiContext}
                />}
            {onSubmit && <Button type="submit" loading={loading}>{submitLabel}</Button>}
        </form>
    );
}
import {ApiContext, SchemaOrReference} from "@/app/lib/model/ApiContext";
import {UpdatableValue} from "@/app/lib/model/UpdatableValue";
import {
    resolveSchemaFromSchemaOrReference
} from "@/app/lib/openapi/utils";
import Box from "@mui/joy/Box";
import {ReactNode} from "react";
import {FileInput} from "./FileInput";
import {SchemaFormControlInput} from "@/app/components/input/SchemaFormControlInput";
import {SchemaPropertiesFormControlInputs} from "@/app/components/input/SchemaPropertiesFormControlInputs";
import {Stack} from "@mui/joy";

export interface SchemaFormControlInputsProps {
    inputsUpdatableValue: UpdatableValue<any>
    schema: SchemaOrReference
    disabled?: boolean
    readonlyProperties?: string[]
    apiContext: ApiContext
}

export const SchemaFormControlInputs = ({
                                            inputsUpdatableValue,
                                            schema,
                                            disabled = false,
                                            readonlyProperties = [],
                                            apiContext
                                        }: SchemaFormControlInputsProps) => {

    const inputs: ReactNode[] = [];
    const schemaObject = resolveSchemaFromSchemaOrReference(schema, apiContext.apiSpec.document);

    if (schemaObject?.format === 'binary') {
        inputs.push(
            <FileInput
                key='schema-input-file'
                updatableValue={inputsUpdatableValue}
                required={false}
                disabled={disabled}/>
        );
    } else if (!schemaObject || !schemaObject.properties) {
        inputs.push(<SchemaFormControlInput
            key='null-schema-property'
            updatableValue={inputsUpdatableValue}
            label={'Default text field'}
            schema={undefined}
            required={false}
            disabled={disabled}
            apiContext={apiContext}/>);
    } else if (schemaObject.properties) {
        inputs.push(<SchemaPropertiesFormControlInputs
            schema={schema}
            propertiesUpdatableValue={inputsUpdatableValue}
            disabled={disabled}
            readonlyProperties={readonlyProperties}
            apiContext={apiContext}/>);
    }

    return (
        <>
            <Stack maxWidth={400}>
                {inputs.map((input, index) => {
                    return (

                        <Box key={`schema-input-${index}`} sx={{mb: 2}}>
                            {input}
                        </Box>
                    );
                })}
            </Stack>
        </>
    )
}
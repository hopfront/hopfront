import { SchemaFormControlInput } from "@/app/components/input/SchemaFormControlInput";
import { SchemaPropertiesFormControlInputs } from "@/app/components/input/SchemaPropertiesFormControlInputs";
import { ApiContext, SchemaOrReference } from "@/app/lib/model/ApiContext";
import { UpdatableValue } from "@/app/lib/model/UpdatableValue";
import {
    resolveSchemaFromSchemaOrReference
} from "@/app/lib/openapi/utils";
import { Stack } from "@mui/joy";
import { FileInput } from "./FileInput";

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

    const schemaObject = resolveSchemaFromSchemaOrReference(schema, apiContext.apiSpec.document);

    const getInputs = () => {
        if (schemaObject?.format === 'binary') {
            return (
                <FileInput
                    key='schema-input-file'
                    updatableValue={inputsUpdatableValue}
                    required={false}
                    disabled={disabled} />
            );
        } else if (!schemaObject || !schemaObject.properties) {
            return (<SchemaFormControlInput
                key='null-schema-property'
                updatableValue={inputsUpdatableValue}
                label={'Default text field'}
                schema={undefined}
                required={false}
                disabled={disabled}
                apiContext={apiContext} />);
        } else if (schemaObject.properties) {
            return (<SchemaPropertiesFormControlInputs
                schema={schema}
                propertiesUpdatableValue={inputsUpdatableValue}
                disabled={disabled}
                readonlyProperties={readonlyProperties}
                apiContext={apiContext} />);
        }
    }

    return (
        <>
            <Stack maxWidth={400} sx={{ mb: 1 }}>
                {getInputs()}
            </Stack>
        </>
    )
}
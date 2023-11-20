import {
    getPropertiesFromSchema,
    getReferenceObjectOrUndefined,
    resolveSchemaFromSchemaOrReference
} from "@/app/lib/openapi/utils";
import {SchemaPropertyFormControlInput} from "@/app/components/input/SchemaPropertyFormControlInput";
import {ApiContext, SchemaOrReference} from "@/app/lib/model/ApiContext";
import {ReactNode, useRef} from "react";
import Box from "@mui/joy/Box";
import {UpdatableValue} from "@/app/lib/model/UpdatableValue";

export interface SchemaPropertiesFormControlInputsProps {
    schema: SchemaOrReference
    propertiesUpdatableValue: UpdatableValue<any>
    disabled?: boolean
    readonlyProperties?: string[]
    apiContext: ApiContext
}

export const SchemaPropertiesFormControlInputs = ({schema, propertiesUpdatableValue, disabled, readonlyProperties = [], apiContext}: SchemaPropertiesFormControlInputsProps) => {
    const schemaReferenceObject = getReferenceObjectOrUndefined(schema);
    const schemaObject = resolveSchemaFromSchemaOrReference(schema, apiContext.apiSpec.document);
    const schemaExtension = schemaReferenceObject &&
        apiContext.extension.schemas.find(ext => ext.schemaRef === schemaReferenceObject.$ref);

    const properties = getPropertiesFromSchema(schemaObject, apiContext.apiSpec.document);

    // We have to use a ref for this because the browser sometimes inject values directly to the input's DOM,
    // and this component doesn't render between the triggered "onChange" of each input.
    const propertiesValuesRef = useRef(propertiesUpdatableValue.value);

    const isPropertyRequired = (propertyName: string): boolean => {
        if (!schemaObject.required) {
            return false;
        }

        return schemaObject.required.indexOf(propertyName) >= 0;
    };

    const inputs: ReactNode[] = [];

    for (let schemaPropertyName in properties) {
        inputs.push(<SchemaPropertyFormControlInput
            propertyParentSchemaRef={schemaReferenceObject?.$ref}
            propertyName={schemaPropertyName}
            propertySchema={properties[schemaPropertyName]}
            propertyExtension={schemaExtension?.properties.find(p => p.propertyName === schemaPropertyName)}
            updatableValue={{
                value: propertiesValuesRef.current && propertiesValuesRef.current[schemaPropertyName],
                onValueUpdate: (updatedPropertyValue: any) => {
                    const updatedInputsValue = Object.assign({}, propertiesValuesRef.current, {[schemaPropertyName]: updatedPropertyValue});
                    propertiesValuesRef.current = updatedInputsValue
                    propertiesUpdatableValue.onValueUpdate(updatedInputsValue);
                },
            }}
            required={isPropertyRequired(schemaPropertyName)}
            disabled={disabled}
            readOnly={readonlyProperties.indexOf(schemaPropertyName) >= 0}
            apiContext={apiContext}/>);
    }

    return (
        <>
            {inputs.map((input, index) => {
                return (
                    <Box key={`schema-input-${index}`} sx={{mb: 2}}>
                        {input}
                    </Box>
                );
            })}
        </>
    );
}
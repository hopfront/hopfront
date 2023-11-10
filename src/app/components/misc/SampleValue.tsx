import Typography from "@mui/joy/Typography";
import {SingleRowAnyPropertyViewer} from "@/app/components/property-viewer/SingleRowAnyPropertyViewer";
import {Stack} from "@mui/joy";
import React from "react";
import {
    getReferenceObjectOrUndefined,
    resolveSchemaFromSchemaOrReference
} from "@/app/lib/openapi/utils";
import {ApiContext, SchemaOrReference} from "@/app/lib/model/ApiContext";
import {SchemaProperty} from "@/app/components/foreign-keys/SchemaPropertyPicker/SchemaPropertyPicker";
import {OpenAPIV3} from "openapi-types";

const extractPropertyValueFromObject = (
    object: any,
    objectSchema: SchemaOrReference,
    schemaProperty: SchemaProperty,
    document: OpenAPIV3.Document): any | undefined => {

    const objectSchemaReferenceObject = getReferenceObjectOrUndefined(objectSchema);

    if (objectSchemaReferenceObject) {
        if (objectSchemaReferenceObject.$ref === schemaProperty.schemaRef) {
            return object[schemaProperty.propertyName];
        } else {
            const schemaObject = resolveSchemaFromSchemaOrReference(objectSchema, document);

            for (const propertyName in schemaObject.properties) {
                const propertySchema = schemaObject.properties[propertyName] as SchemaOrReference;

                const value = extractPropertyValueFromObject(object, propertySchema, schemaProperty, document);

                if (value) {
                    return value;
                }
            }
        }
    }

    return undefined;
}


export interface SampleValueProps {
    sampleObject: any
    sampleObjectSchema: SchemaOrReference
    schemaProperty: SchemaProperty
    apiContext: ApiContext
}

export const SampleValue = ({sampleObject, sampleObjectSchema, schemaProperty, apiContext}: SampleValueProps) => {
    const sampleValue = schemaProperty && extractPropertyValueFromObject(sampleObject, sampleObjectSchema, schemaProperty, apiContext.apiSpec.document);

    return (
        <Stack sx={{ml: 1}} direction="column" justifyContent="center">
            <Typography>
                <Typography>(Sample value=</Typography>
                <Typography variant="outlined">
                    <SingleRowAnyPropertyViewer propertyValue={sampleValue} apiContext={apiContext}/>
                </Typography>
                <Typography>)</Typography>
            </Typography>
        </Stack>
    );
}
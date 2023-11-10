import {StandaloneOperation} from "@/app/lib/model/StandaloneOperation";
import {OpenAPIV3} from "openapi-types";
import ResponseObject = OpenAPIV3.ResponseObject;
import React from "react";
import "@/app/components/foreign-keys/SchemaPropertyPicker/styles.css";

import {
    SchemaProperty,
    SchemaPropertyPicker
} from "@/app/components/foreign-keys/SchemaPropertyPicker/SchemaPropertyPicker";
import {getReferenceObjectOrUndefined} from "@/app/lib/openapi/utils";

export interface OperationResponseSchemaPropertyPickerProps {
    operation: StandaloneOperation
    status: string
    contentType: string
    schemaPropertyPredicate: (schemaProperty: SchemaProperty) => boolean
    defaultSchemaProperty?: SchemaProperty,
    onSchemaPropertySelected: (schemaPropertySelected: SchemaProperty) => void
}

export const OperationResponseSchemaPropertyPicker = ({
                                                          operation,
                                                          status,
                                                          contentType,
                                                          schemaPropertyPredicate,
                                                          defaultSchemaProperty,
                                                          onSchemaPropertySelected,
                                                      }: OperationResponseSchemaPropertyPickerProps) => {

    const response = operation.operation.responses[status] as ResponseObject;

    if (!response || !response.content) {
        return null;
    }

    const content = response.content[contentType];

    if (!content || !content.schema) {
        return null;
    }

    const schemaReferenceObject = getReferenceObjectOrUndefined(content.schema);

    return schemaReferenceObject && <SchemaPropertyPicker
        schemaRef={schemaReferenceObject.$ref}
        schemaPropertyPredicate={schemaPropertyPredicate}
        defaultSchemaProperty={defaultSchemaProperty}
        onSchemaPropertySelected={onSchemaPropertySelected}
        apiSpec={operation.apiSpec}/>;
}
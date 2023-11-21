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
import SchemaObject = OpenAPIV3.SchemaObject;
import ReferenceObject = OpenAPIV3.ReferenceObject;

const getResponseSchemaReferenceObject = (operation: StandaloneOperation, status: string, contentType: string): ReferenceObject | undefined => {
    const response = operation.operation.responses[status] as ResponseObject;

    if (!response || !response.content) {
        return undefined;
    }

    const content = response.content[contentType];

    if (!content || !content.schema) {
        return undefined;
    }

    if (content.schema.hasOwnProperty('type')) {
        const schemaObject = content.schema as SchemaObject;

        if (schemaObject.type === "array") {
            return getReferenceObjectOrUndefined(schemaObject.items);
        } else {
            return getReferenceObjectOrUndefined(content.schema);
        }
    } else {
        return getReferenceObjectOrUndefined(content.schema);
    }
}


export interface OperationResponseSchemaPropertyPickerProps {
    operation: StandaloneOperation
    status: string
    contentType: string
    schemaPropertyPredicate: (schemaProperty: SchemaProperty) => boolean
    defaultSchemaProperty?: SchemaProperty,
    disabled?: boolean
    onSchemaPropertySelected: (schemaPropertySelected: SchemaProperty) => void
}

export const OperationResponseSchemaPropertyPicker = ({
                                                          operation,
                                                          status,
                                                          contentType,
                                                          schemaPropertyPredicate,
                                                          defaultSchemaProperty,
                                                          disabled = false,
                                                          onSchemaPropertySelected,
                                                      }: OperationResponseSchemaPropertyPickerProps) => {

    const responseSchemaReferenceObject = getResponseSchemaReferenceObject(operation, status, contentType);

    return responseSchemaReferenceObject && <SchemaPropertyPicker
        schemaRef={responseSchemaReferenceObject.$ref}
        schemaPropertyPredicate={schemaPropertyPredicate}
        defaultSchemaProperty={defaultSchemaProperty}
        onSchemaPropertySelected={onSchemaPropertySelected}
        disabled={disabled}
        apiSpec={operation.apiSpec}/>;
}
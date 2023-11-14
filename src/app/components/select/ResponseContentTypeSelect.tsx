import {StandaloneOperation} from "@/app/lib/model/StandaloneOperation";
import {OpenAPIV3} from "openapi-types";
import ResponseObject = OpenAPIV3.ResponseObject;
import {Button} from "@mui/joy";
import * as React from "react";
import {SchemaRefSelect} from "./SchemaRefSelect";
import {useState} from "react";

const getResponseContentTypeOptions = (operation: StandaloneOperation | undefined, status: string | undefined): string[] => {
    if (!operation || !status) {
        return [];
    }

    const response = operation.operation.responses[status] as ResponseObject;

    if (!response) {
        return [];
    }

    return response.content ? Object.keys(response.content).sort((a, b) => a.localeCompare(b)) : [];
};

export interface ResponseContentTypeSelectProps {
    defaultContentType?: string
    operation: StandaloneOperation
    status: string
    disabled?: boolean
    onChange: (contentType: string) => void
}

const MIN_WIDTH = 250;

export const ResponseContentTypeSelect = ({
                                              defaultContentType,
                                              operation,
                                              status,
                                              disabled = false,
                                              onChange
                                          }: ResponseContentTypeSelectProps) => {

    const options = getResponseContentTypeOptions(operation, status);

    const [contentType, setContentType] = useState<string | undefined>(defaultContentType);

    if (!contentType && options.length > 0) {
        setContentType(options[0]);
        onChange(options[0]);
    }

    if (options.length > 0) {
        return (
            <SchemaRefSelect
                value={contentType}
                schemaRefs={options}
                disabled={disabled}
                onChange={value => onChange(value as string)}
                sx={{minWidth: MIN_WIDTH}}/>
        );
    } else {
        return (
            <Button disabled sx={{minWidth: MIN_WIDTH}}>No Content-Type available</Button>
        );
    }
}
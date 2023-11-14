import {ResponseStatusSelect} from "@/app/components/select/ResponseStatusSelect";
import {ResponseContentTypeSelect} from "@/app/components/select/ResponseContentTypeSelect";
import {
    SchemaProperty
} from "@/app/components/foreign-keys/SchemaPropertyPicker/SchemaPropertyPicker";
import {StandaloneOperation} from "@/app/lib/model/StandaloneOperation";
import {useState} from "react";
import {Stack} from "@mui/joy";
import FormControl from "@mui/joy/FormControl";
import FormLabel from "@mui/joy/FormLabel";
import Card from "@mui/joy/Card";
import {Monospace} from "@/app/components/typography/Monospace";
import {
    OperationResponseSchemaPropertyPicker
} from "@/app/components/foreign-keys/OperationResponseSchemaPropertyPicker";

export interface ResponseSchemaProperty {
    status: string
    contentType: string
    schemaRef: string
    propertyName: string
}

export interface ResponseSchemaPropertySelectorProps {
    defaultSchemaProperty?: ResponseSchemaProperty
    schemaPropertyPredicate: (schemaProperty: SchemaProperty) => boolean
    onResponseSchemaPropertySelected: (responseSchemaProperty: ResponseSchemaProperty) => void
    disabled?: boolean
    operation: StandaloneOperation
}

export const ResponseSchemaPropertySelector = ({
                                                   defaultSchemaProperty,
                                                   schemaPropertyPredicate,
                                                   onResponseSchemaPropertySelected,
                                                   disabled = false,
                                                   operation
                                               }: ResponseSchemaPropertySelectorProps) => {

    const [responseStatus, setResponseStatus] = useState<string | undefined>(defaultSchemaProperty?.status);
    const [responseContentType, setResponseContentType] = useState<string | undefined>(defaultSchemaProperty?.contentType);

    return (
        <Card>
            <Stack direction="row">
                <FormControl sx={{}}>
                    <FormLabel><Monospace level="body-xs">Status</Monospace></FormLabel>
                    <ResponseStatusSelect
                        defaultStatus={responseStatus}
                        operation={operation}
                        disabled={disabled}
                        onChange={status => setResponseStatus(status)}/>
                </FormControl>
                {responseStatus && <FormControl sx={{ml: 1}}>
                    <FormLabel><Monospace level="body-xs">Content-Type</Monospace></FormLabel>
                    <ResponseContentTypeSelect
                        defaultContentType={responseContentType}
                        operation={operation}
                        status={responseStatus}
                        disabled={disabled}
                        onChange={contentType => setResponseContentType(contentType)}/>
                </FormControl>}
            </Stack>
            {(responseStatus && responseContentType) ? <Card sx={{mt: 1}}>
                <Monospace level="body-xs">Body</Monospace>
                <OperationResponseSchemaPropertyPicker
                    operation={operation}
                    status={responseStatus}
                    contentType={responseContentType}
                    schemaPropertyPredicate={schemaPropertyPredicate}
                    defaultSchemaProperty={defaultSchemaProperty}
                    disabled={disabled}
                    onSchemaPropertySelected={schemaPropertySelected => {
                        onResponseSchemaPropertySelected({
                            status: responseStatus,
                            contentType: responseContentType,
                            schemaRef: schemaPropertySelected.schemaRef,
                            propertyName: schemaPropertySelected.propertyName
                        })
                    }}/>
            </Card> : <Card variant="soft"></Card>}
        </Card>
    );
}
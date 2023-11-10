import {ApiContext} from "@/app/lib/model/ApiContext";
import {getSchemaByRef} from "@/app/lib/openapi/utils";
import {SingleRowAnyPropertyViewer} from "@/app/components/property-viewer/SingleRowAnyPropertyViewer";
import {Box, Button, Skeleton, Stack, Typography} from "@mui/joy";
import React, {ReactNode} from "react";
import {ResponseSchemaSelectedObserver} from "@/app/lib/model/ResponseSchemaSelectedObserver";

export interface ObjectViewProps {
    object: any
    schemaRef?: string
    loading?: boolean
    responseSchemaSelectedObserver?: ResponseSchemaSelectedObserver
    apiContext: ApiContext
}

export const ObjectView = ({object, schemaRef, loading = false, apiContext, responseSchemaSelectedObserver}: ObjectViewProps) => {
    const isObjectPickable = (): boolean => {
        if (!schemaRef || !responseSchemaSelectedObserver) {
            return false;
        }

        return schemaRef === responseSchemaSelectedObserver.schemaRef;
    }

    const schemaObject = schemaRef && getSchemaByRef(schemaRef, apiContext.apiSpec.document);
    const schemaExtension = apiContext.extension.schemas.find(se => se.schemaRef === schemaRef);

    const rows: ReactNode[] = Object.keys(object).flatMap(objectKey => {
        const propertySchema = (schemaObject && schemaObject.properties)
            ? schemaObject.properties[objectKey]
            : undefined;


        const propertyExtension = schemaExtension?.properties.find(pe => pe.propertyName === objectKey);

        if (propertyExtension?.visibility === "only-config-views") {
            return [];
        }

        const value = object[objectKey];

        const objectLabel = (schemaExtension?.properties || []).find(pe => pe.propertyName === objectKey)?.label || objectKey;

        const key = <Typography
            style={{fontWeight: 'bold', marginRight: '8px'}}><Skeleton loading={loading}>
            {objectLabel}:
        </Skeleton>
        </Typography>;

        if (!value) {
            return <Typography key={objectKey} sx={{mb: 1}}>
                {key}
                undefined
            </Typography>
        }
        return [(
            <Stack key={objectKey} direction="row" sx={{mb: 1}}>
                {key}
                <SingleRowAnyPropertyViewer
                    propertyValue={value}
                    propertySchema={propertySchema}
                    loading={loading}
                    responseSchemaSelectedObserver={responseSchemaSelectedObserver}
                    apiContext={apiContext}
                    fromObjectView={true}/>
            </Stack>
        )];
    });

    const onObjectPicked = () => {
        if (responseSchemaSelectedObserver) {
            responseSchemaSelectedObserver.onValueSelected(object);
        }
    }

    return (
        <Box>
            {rows}
            {isObjectPickable() ? <Button disabled={loading} onClick={onObjectPicked} size="sm">Pick</Button> : null}
        </Box>
    )
}
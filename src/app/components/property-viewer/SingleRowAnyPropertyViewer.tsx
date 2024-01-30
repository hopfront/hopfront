import {ObjectView} from "@/app/components/property-viewer/ObjectView";
import {SingleRowArrayPropertyViewer} from "@/app/components/property-viewer/SingleRowArrayPropertyViewer";
import {SingleRowObjectPropertyViewer} from "@/app/components/property-viewer/SingleRowObjectPropertyViewer";
import {SingleRowScalarPropertyViewer} from "@/app/components/property-viewer/SingleRowScalarPropertyViewer";
import React, {ReactNode, useState} from "react";
import {ResponsiveModal} from "../modal/ResponsiveModal";
import {ApiContext, SchemaOrReference} from "@/app/lib/model/ApiContext";
import {
    getReferenceObjectOrUndefined,
    getSchemaExtension,
    resolveSchemaFromSchemaOrReference
} from "@/app/lib/openapi/utils";
import {OpenAPIV3} from "openapi-types";
import {Box} from "@mui/joy";
import {ResponseSchemaSelectedObserver} from "@/app/lib/model/ResponseSchemaSelectedObserver";
import ArraySchemaObject = OpenAPIV3.ArraySchemaObject;
import NonArraySchemaObject = OpenAPIV3.NonArraySchemaObject;
import ReferenceObject = OpenAPIV3.ReferenceObject;

export interface SingleRowAnyPropertyViewerProps {
    propertyValue: any
    propertySchema?: SchemaOrReference
    loading?: boolean
    responseSchemaSelectedObserver?: ResponseSchemaSelectedObserver
    startDecorator?: ReactNode,
    fromObjectView?: boolean,
    apiContext: ApiContext
    sx?: {}
}

export const SingleRowAnyPropertyViewer = ({
                                               propertyValue,
                                               propertySchema,
                                               loading,
                                               responseSchemaSelectedObserver,
                                               apiContext,
                                               startDecorator,
                                               fromObjectView = false,
                                               sx
                                           }: SingleRowAnyPropertyViewerProps) => {
    const [openNextLevelOfData, setOpenNextLevelOfData] = useState(false);
    const [nextLevelData, setNextLevelData] = useState<{} | any[]>({});

    const showNextLevelOfData = (event: React.MouseEvent<HTMLButtonElement>, data: {} | any[]) => {
        event.stopPropagation();
        setNextLevelData(data)
        setOpenNextLevelOfData(true)
    }

    const propertyViewer = () => {
        if (Array.isArray(propertyValue)) {
            const arraySchema =
                propertySchema && resolveSchemaFromSchemaOrReference(propertySchema, apiContext.apiSpec.document) as ArraySchemaObject;

            return <SingleRowArrayPropertyViewer
                property={propertyValue}
                schema={arraySchema}
                loading={loading}
                responseSchemaSelectedObserver={responseSchemaSelectedObserver}
                apiContext={apiContext}
                fromObjectView={fromObjectView}
            />;
        } else if (typeof propertyValue === 'object') {
            let schemaRef = undefined;

            if (propertySchema?.hasOwnProperty('$ref')) {
                schemaRef = getSchemaExtension((propertySchema as ReferenceObject).$ref, apiContext);
            }

            return <SingleRowObjectPropertyViewer
                property={propertyValue}
                propertySchemaExtension={schemaRef}
                loading={loading}
                onClick={(event) => {
                    showNextLevelOfData(event, propertyValue)
                }}
                startDecorator={startDecorator}/>;
        } else {
            return <SingleRowScalarPropertyViewer
                property={propertyValue}
                schema={propertySchema as NonArraySchemaObject}
                loading={loading}/>;
        }
    }

    // If it's a primitive or a list of primitive we display it inline, otherwise we display it as a block
    const displayStyle = Array.isArray(propertyValue) && (Array.isArray(propertyValue[0]) || typeof propertyValue[0] === 'object')
        ? 'block' : 'inline-block';

    const propertySchemaReferenceObject =
        propertySchema && getReferenceObjectOrUndefined(propertySchema);

    return (
        <>
            <Box sx={{...sx, display: displayStyle}}>
                {propertyViewer()}
            </Box>

            <span onClick={(event) => event.stopPropagation()}>
                <ResponsiveModal
                    aria-labelledby="close-modal-title"
                    open={openNextLevelOfData}
                    onClose={(_event: React.MouseEvent<HTMLButtonElement>, reason: string) => {
                        setOpenNextLevelOfData(false);
                        setNextLevelData({})
                    }}
                >
                    <ObjectView
                        object={nextLevelData}
                        schemaRef={propertySchemaReferenceObject?.$ref}
                        apiContext={apiContext}/>
                </ResponsiveModal>
            </span>
        </>
    );
}
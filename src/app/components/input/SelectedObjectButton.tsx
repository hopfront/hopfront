import {ObjectLabel} from "@/app/components/typography/ObjectLabel";
import {Button} from "@mui/joy";
import React, {useState} from "react";
import {ObjectView} from "@/app/components/property-viewer/ObjectView";
import {ResponsiveModal} from "@/app/components/modal/ResponsiveModal";
import {useApiContext} from "@/app/hooks/useApiContext";
import {SxProps} from "@mui/joy/styles/types";
import {getSchemaByRef} from "@/app/lib/openapi/utils";

export interface SelectedObjectButtonProps {
    selectedObject?: any
    selectedSchemaRef?: string
    apiSpecId?: string
    disabled?: boolean
    sx?: SxProps
}

export const SelectedObjectButton = ({selectedObject, selectedSchemaRef, apiSpecId, disabled, sx}: SelectedObjectButtonProps) => {
    const [open, setOpen] = useState(false);
    const {data: apiContext, error, isLoading} = useApiContext(apiSpecId);

    const schema = (selectedSchemaRef && apiContext) && getSchemaByRef(selectedSchemaRef, apiContext.apiSpec.document);

    return (
        <>
            <Button
                data-first-child
                onClick={() => setOpen(true)}
                disabled={disabled || !selectedObject || typeof selectedObject !== "object" || isLoading}
                sx={{minWidth: '120px', display: 'flex', alignItems: 'center', justifyContent: 'start', ...sx}}>
                {selectedObject
                    ? <ObjectLabel object={selectedObject} />
                    : 'None'}
            </Button>
            <ResponsiveModal
                aria-labelledby="close-modal-title"
                open={open}
                onClose={(_event: React.MouseEvent<HTMLButtonElement>, reason: string) => {
                    setOpen(false);
                }}
            >
                {schema && apiContext && <ObjectView object={selectedObject} schemaRef={selectedSchemaRef} apiContext={apiContext}/>}
            </ResponsiveModal>
        </>
    );
}
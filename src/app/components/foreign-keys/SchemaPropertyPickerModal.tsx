import {
    SchemaProperty,
    SchemaPropertyPicker
} from "@/app/components/foreign-keys/SchemaPropertyPicker/SchemaPropertyPicker";
import {ApiSpec} from "@/app/lib/dto/ApiSpec";
import {ResponsiveModal} from "@/app/components/modal/ResponsiveModal";
import {useState} from "react";
import {Button} from "@mui/joy";
import Typography from "@mui/joy/Typography";
import {SchemaRefLabel} from "@/app/settings/schemas/SchemaRefLabel";

export interface SchemaPropertyPickerModalProps {
    open: boolean
    onClose: () => void
    schemaRef: string
    defaultSchemaProperty?: SchemaProperty
    schemaPropertyPredicate: (schemaProperty: SchemaProperty) => boolean
    onSchemaPropertySelected: (schemaPropertySelected: SchemaProperty) => void
    apiSpec: ApiSpec
}

export const SchemaPropertyPickerModal = ({open, onClose, schemaRef, defaultSchemaProperty, schemaPropertyPredicate, onSchemaPropertySelected, apiSpec}: SchemaPropertyPickerModalProps) => {
    const [schemaProperty, setSchemaProperty] = useState<SchemaProperty | undefined>(defaultSchemaProperty);

    return (
        <ResponsiveModal open={open} onClose={onClose}>
            <Typography level="title-lg" sx={{mb: 2}}>Select a property from schema: <SchemaRefLabel schemaRef={schemaRef}/></Typography>
            <SchemaPropertyPicker
                schemaRef={schemaRef}
                defaultSchemaProperty={schemaProperty}
                schemaPropertyPredicate={schemaPropertyPredicate}
                onSchemaPropertySelected={schemaPropertySelected => setSchemaProperty(schemaPropertySelected)}
                apiSpec={apiSpec}/>
            <Button
                onClick={() => schemaProperty && onSchemaPropertySelected(schemaProperty)}
                disabled={!schemaProperty}
                sx={{mt: 2}}>
                OK
            </Button>
            <Button variant="outlined" onClick={() => {
                setSchemaProperty(undefined);
                onClose();
            }} sx={{ml: 1}}>Cancel</Button>
        </ResponsiveModal>
    );
}
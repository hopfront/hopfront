import {SchemaProperty, SchemaPropertyPicker} from "@/app/components/foreign-keys/SchemaPropertyPicker/SchemaPropertyPicker";
import {ResponsiveModal} from "@/app/components/modal/ResponsiveModal";
import Card from "@mui/joy/Card";
import {useState} from "react";
import {ApiSpec} from "@/app/lib/dto/ApiSpec";
import {Button} from "@mui/joy";
import Typography from "@mui/joy/Typography";
import {getSchemaPropertyType} from "@/app/lib/openapi/utils";

export interface SchemaPropertyMapping {
    source: SchemaProperty
    target: SchemaProperty
}

export interface SchemaPropertyMappingModalProps {
    open: boolean
    onClose: () => void
    sourceSchemaRef: string
    targetSchemaRef: string
    onMappingDone: (mapping: SchemaPropertyMapping) => void
    apiSpec: ApiSpec
}

export const SchemaPropertyMappingModal = ({open, onClose, sourceSchemaRef, targetSchemaRef, onMappingDone, apiSpec}: SchemaPropertyMappingModalProps) => {
    const [sourceProperty, setSourceProperty] = useState<SchemaProperty | undefined>();
    const [targetProperty, setTargetProperty] = useState<SchemaProperty | undefined>();

    return (
        <ResponsiveModal open={open} onClose={() => {
            setSourceProperty(undefined);
            setTargetProperty(undefined);
            onClose();
        }}>
            <Card>
                <Typography level="title-lg">Source</Typography>
                <SchemaPropertyPicker
                    schemaRef={sourceSchemaRef}
                    schemaPropertyPredicate={() => true}
                    onSchemaPropertySelected={schemaPropertySelected => setSourceProperty(schemaPropertySelected)}
                    apiSpec={apiSpec}/>
            </Card>
            <Card sx={{mt: 2}}>
                <Typography level="title-lg">Target</Typography>
                <SchemaPropertyPicker
                    schemaRef={targetSchemaRef}
                    schemaPropertyPredicate={schemaProperty => {
                        const schemaPropertyType = getSchemaPropertyType(schemaProperty, apiSpec);
                        return schemaPropertyType === (sourceProperty ? getSchemaPropertyType(sourceProperty, apiSpec) : "");
                    }}
                    onSchemaPropertySelected={schemaPropertySelected => setTargetProperty(schemaPropertySelected)}
                    apiSpec={apiSpec}/>
            </Card>
            <Button
                disabled={sourceProperty === undefined || targetProperty === undefined}
                onClick={() => {
                    if (sourceProperty && targetProperty) {
                        onMappingDone({
                            source: sourceProperty,
                            target: targetProperty
                        });
                        setSourceProperty(undefined);
                        setTargetProperty(undefined);
                    }
                }}
                sx={{mt: 2}}>
                OK
            </Button>
            <Button
                variant="outlined"
                onClick={() => {
                    setSourceProperty(undefined);
                    setTargetProperty(undefined);
                    onClose();
                }}
                sx={{ml: 1}}>Cancel</Button>
        </ResponsiveModal>
    );
}
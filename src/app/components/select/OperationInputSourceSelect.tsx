import { SchemaProperty } from "@/app/components/foreign-keys/SchemaPropertyPicker/SchemaPropertyPicker";
import { SchemaPropertyPickerModal } from "@/app/components/foreign-keys/SchemaPropertyPickerModal";
import { ApiContext, SchemaOrReference } from "@/app/lib/model/ApiContext";
import { getReferenceObjectOrUndefined, getSchemaPropertyType, schemaRefToHumanLabel } from "@/app/lib/openapi/utils";
import { SchemaPropertyLabel } from "@/app/settings/schemas/SchemaPropertyLabel";
import { Button, Option, Select, Stack } from "@mui/joy";
import Typography from "@mui/joy/Typography";
import { useState } from "react";
import { SampleValue } from "../misc/SampleValue";

type InputSourceType = "user" | "foreignKey";

export interface OperationInputSourceSelectProps {
    schema: SchemaOrReference
    sampleObject: any
    inputType?: string
    onSchemaPropertySelected: (schemaPropertySelected: SchemaProperty) => void
    onUserInputSelected: () => void
    disabled: boolean
    apiContext: ApiContext
}

export const OperationInputSourceSelect = ({ schema, sampleObject, inputType, onSchemaPropertySelected, onUserInputSelected, disabled, apiContext }: OperationInputSourceSelectProps) => {
    const [selectedType, setSelectedType] = useState<InputSourceType>("user");
    const [propertyPickerOpen, setPropertyPickerOpen] = useState(false);
    const [schemaProperty, setSchemaProperty] = useState<SchemaProperty | undefined>();

    const schemaReferenceObject = getReferenceObjectOrUndefined(schema);

    return (
        <Stack direction="row">
            <Select
                disabled={disabled}
                value={selectedType}
                onChange={(_, value) => {
                    if (value) {
                        setSelectedType(value);

                        if (value === "user") {
                            setSchemaProperty(undefined);
                            onUserInputSelected();
                        }
                    }
                }}>
                <Option value="user">User Input</Option>
                <Option value="foreignKey"><Typography>Pull value from {schemaReferenceObject && schemaRefToHumanLabel(schemaReferenceObject.$ref)}</Typography></Option>
            </Select>
            {(selectedType === "foreignKey") &&
                (schemaProperty
                    ? <Stack direction="row">
                        <Stack sx={{ ml: 1 }} direction="column" justifyContent="center">
                            <SchemaPropertyLabel
                                schemaRef={schemaProperty.schemaRef}
                                propertyName={schemaProperty.propertyName}
                                onClick={() => setPropertyPickerOpen(true)} />
                        </Stack>
                        <Stack direction="column" justifyContent="center">
                            <Typography level="body-xs">
                                <SampleValue
                                    sampleObject={sampleObject}
                                    sampleObjectSchema={schema}
                                    schemaProperty={schemaProperty}
                                    apiContext={apiContext} />
                            </Typography>
                        </Stack>
                    </Stack>
                    : <Button
                        onClick={() => setPropertyPickerOpen(true)}
                        sx={{ ml: 1 }}>
                        Pick a value
                    </Button>)}
            {(selectedType === "foreignKey" && schemaReferenceObject) && <SchemaPropertyPickerModal
                open={propertyPickerOpen}
                onClose={() => setPropertyPickerOpen(false)}
                schemaRef={schemaReferenceObject.$ref}
                defaultSchemaProperty={schemaProperty}
                schemaPropertyPredicate={schemaPropertyPicked => {
                    if (!inputType) return true;
                    const schemaPropertyPickedType = getSchemaPropertyType(schemaPropertyPicked, apiContext.apiSpec);
                    return schemaPropertyPickedType === inputType;
                }}
                onSchemaPropertySelected={schemaPropertySelected => {
                    setSchemaProperty(schemaPropertySelected);
                    setPropertyPickerOpen(false);
                    onSchemaPropertySelected(schemaPropertySelected);
                }}
                apiSpec={apiContext.apiSpec} />}
        </Stack>
    );
}
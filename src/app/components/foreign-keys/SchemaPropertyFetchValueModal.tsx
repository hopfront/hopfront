import {ResponsiveModal} from "@/app/components/modal/ResponsiveModal";
import {ApiSpecSelect} from "@/app/components/select/ApiSpecSelect";
import React, {ReactNode, useState} from "react";
import {ApiSpec} from "@/app/lib/dto/ApiSpec";
import {OperationSelect} from "@/app/components/select/OperationSelect";
import {StandaloneOperation} from "@/app/lib/model/StandaloneOperation";
import {
    SchemaProperty
} from "@/app/components/foreign-keys/SchemaPropertyPicker/SchemaPropertyPicker";
import {ResponseSchemaPropertySelector} from "@/app/components/input/ResponseSchemaPropertySelector";
import {Accordion, AccordionDetails, AccordionGroup, AccordionSummary, Box, Button, Card, Stack} from "@mui/joy";
import Typography from "@mui/joy/Typography";
import {ApiContext} from "@/app/lib/model/ApiContext";
import {OperationLabel} from "@/app/components/typography/OperationLabel";
import {ForeignKey} from "@/app/lib/dto/OpenApiExtensions";
import {ForeignKeyInputPreview} from "@/app/components/foreign-keys/ForeignKeyInputPreview";
import {InfoAlert} from "@/app/components/alert/InfoAlert";
import {SchemaPropertyLabel} from "@/app/settings/schemas/SchemaPropertyLabel";
import {AutoFixHigh, Key} from "@mui/icons-material";
import {ExtensionApi} from "@/app/lib/api/ExtensionApi";
import {ErrorAlert} from "@/app/components/operation/response/ErrorAlert";
import {ButtonRow} from "@/app/components/button/ButtonRow";
import {getSchemaPropertyType} from "@/app/lib/openapi/utils";


export interface SchemaPropertyFetchValueModalProps {
    open: boolean
    onClose: () => void
    onConfigurationUpdate: () => void
    property: SchemaProperty
    propertyRequired: boolean
    inputWithoutForeignKeyPreview: ReactNode
    apiContext: ApiContext
}

export const SchemaPropertyFetchValueModal = ({
                                                  open,
                                                  onClose,
                                                  onConfigurationUpdate,
                                                  property,
                                                  propertyRequired,
                                                  inputWithoutForeignKeyPreview,
                                                  apiContext
                                              }: SchemaPropertyFetchValueModalProps) => {

    const [apiSpec, setApiSpec] = useState<ApiSpec | undefined>(apiContext.apiSpec);
    const [foreignKeyOperation, setForeignKeyOperation] = useState<StandaloneOperation | undefined>();
    const [schemaPropertySelected, setSchemaPropertySelected] = useState<SchemaProperty | undefined>();
    const [error, setError] = useState<any | undefined>();
    const [submitting, setSubmitting] = useState(false);

    const propertySchemaPropertyType = getSchemaPropertyType(property, apiContext.apiSpec);

    const currentForeignKey = (apiSpec && schemaPropertySelected) && {
        apiSpecId: apiSpec.id,
        schemaRef: schemaPropertySelected?.schemaRef,
        propertyName: schemaPropertySelected?.propertyName,
    } as ForeignKey;

    const onSubmit = () => {
        if (!currentForeignKey) {
            setError(new Error('Cannot submit empty foreign key.'));
            return;
        }

        setError(undefined);
        setSubmitting(true);

        ExtensionApi.saveSchemaPropertyForeignKey(
            apiContext.apiSpec.id,
            property.schemaRef,
            property.propertyName,
            currentForeignKey)
            .then(() => {
                setError(undefined);
                setSubmitting(false);
                onConfigurationUpdate();
            })
            .catch(reason => {
                setError(reason);
                setSubmitting(false);
            });
    };

    return (
        <ResponsiveModal open={open} onClose={onClose}>
            <Typography level="h1"><Typography><AutoFixHigh/></Typography> Smart Input configuration</Typography>
            <Card sx={{mt: 2}} variant="soft">
                <Typography level="title-lg">1. Which input should be injected with a value?</Typography>
                <SchemaPropertyLabel schemaRef={property.schemaRef} propertyName={property.propertyName}/>
            </Card>
            <Card sx={{mt: 2}}>
                <Typography level="title-lg">2. Where does the injected value come from?</Typography>

                <ApiSpecSelect
                    defaultApiSpecId={apiSpec?.id}
                    onApiSpecSelected={selectedApiSpec => {setForeignKeyOperation(undefined); setApiSpec(selectedApiSpec)}}/>

                {apiSpec && <OperationSelect
                    onOperationSelected={selectedOperation => setForeignKeyOperation(selectedOperation)}
                    apiSpec={apiSpec}/>}

                {(apiSpec && foreignKeyOperation) && <Box>
                    <ResponseSchemaPropertySelector
                        schemaPropertyPredicate={schemaProperty => {
                            const schemaPropertyType = getSchemaPropertyType(schemaProperty, apiSpec);
                            return propertySchemaPropertyType === schemaPropertyType;
                        }}
                        onResponseSchemaPropertySelected={schemaProperty => setSchemaPropertySelected(schemaProperty)}
                        operation={foreignKeyOperation}/>
                </Box>}
            </Card>
            {(foreignKeyOperation && schemaPropertySelected) && <Card sx={{mt: 2}} variant="soft">
                <Typography level="title-lg">3. Configuration result preview</Typography>
                <Stack direction="row">
                    <Typography><OperationLabel operation={foreignKeyOperation} mode="human"/></Typography>
                    <Typography> </Typography>
                    <Typography>
                        <Typography variant="outlined" fontFamily="monospace">
                            <Typography>→ </Typography>
                            {schemaPropertySelected.propertyName !== property.propertyName &&
                                <Typography>{schemaPropertySelected.propertyName}=</Typography>}
                            <Typography>{property.propertyName} →</Typography>
                        </Typography>
                    </Typography>
                    <Typography> </Typography>
                    <SchemaPropertyLabel schemaRef={property.schemaRef} propertyName={property.propertyName}/>
                </Stack>
                {currentForeignKey && <>
                    <AccordionGroup variant="outlined">
                        <Accordion>
                            <AccordionSummary>
                                <Typography level="title-md"><Typography><Key/></Typography>
                                    New Foreign Key</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <InfoAlert
                                    title={<Typography>This configuration will create a Foreign Key from an <Typography
                                        variant="outlined">Schema Property</Typography> to another <Typography
                                        variant="outlined">Schema property</Typography>.</Typography>}
                                    sx={{mt: 1, mb: 1,}}>
                                </InfoAlert>
                                <Card variant="plain">
                                    <Typography level="title-sm">Foreign Key</Typography>
                                    <Stack direction="row">
                                        <Typography fontFamily="monospace">
                                            Source:
                                        </Typography>
                                        <SchemaPropertyLabel schemaRef={property.schemaRef}
                                                             propertyName={property.propertyName}/>
                                    </Stack>
                                    <Stack direction="row">
                                        <Typography>
                                            <Typography fontFamily="monospace">
                                                Target:
                                            </Typography>
                                        </Typography>
                                        <Typography>
                                            <Typography variant="outlined">
                                                <SchemaPropertyLabel
                                                    schemaRef={schemaPropertySelected.schemaRef}
                                                    propertyName={schemaPropertySelected.propertyName}/>
                                            </Typography>
                                        </Typography>
                                    </Stack>
                                </Card>
                            </AccordionDetails>
                        </Accordion>
                        <Accordion>
                            <AccordionSummary>
                                <Typography level="title-md"><Typography><AutoFixHigh/></Typography>
                                    User Input Improvement</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <InfoAlert
                                    title="This configuration will improve the way HopFront asks the user for values."
                                    sx={{mt: 1, mb: 1,}}>
                                    <Typography>Bellow is a <Typography variant="outlined"
                                                                        color="warning">before</Typography>/<Typography
                                        variant="outlined" color="success">after</Typography> visualization of how
                                        HopFront improves the input showed to the user as a result of the above
                                        configuration.</Typography>
                                </InfoAlert>
                                <Card sx={{mb: 1}}>
                                    <Typography>
                                        <Typography level="body-sm" variant="outlined" color="warning">
                                            Without configuration
                                        </Typography>
                                    </Typography>
                                    {inputWithoutForeignKeyPreview}
                                </Card>
                                <Card>
                                    <Typography>
                                        <Typography level="body-sm" variant="outlined" color="success">
                                            With configuration
                                        </Typography>
                                    </Typography>
                                    <ForeignKeyInputPreview
                                        inputLabel={property.propertyName}
                                        required={propertyRequired}
                                        foreignKeys={[currentForeignKey]}/>
                                </Card>
                            </AccordionDetails>
                        </Accordion>
                    </AccordionGroup>
                </>}
            </Card>}
            <ButtonRow align="right" sx={{mt: 2}}>
                <Button
                    disabled={!currentForeignKey || submitting}
                    loading={submitting}
                    onClick={onSubmit}
                    sx={{mt: 2}}>Submit</Button>
                <Button variant="outlined" sx={{mt: 2, ml: 1}} onClick={onClose}>Cancel</Button>
            </ButtonRow>
            <ErrorAlert error={error}/>
        </ResponsiveModal>
    );
}
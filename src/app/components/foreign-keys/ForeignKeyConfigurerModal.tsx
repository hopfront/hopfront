import Select from "@mui/joy/Select";
import Option from "@mui/joy/Option";
import {getSchemaByRef, schemaIsOutput} from "@/app/lib/openapi/utils";
import {ResponsiveModal} from "@/app/components/modal/ResponsiveModal";
import React, {useState} from "react";
import {OpenAPIV3} from "openapi-types";
import SchemaObject = OpenAPIV3.SchemaObject;
import ReferenceObject = OpenAPIV3.ReferenceObject;
import NonArraySchemaObject = OpenAPIV3.NonArraySchemaObject;
import ArraySchemaObject = OpenAPIV3.ArraySchemaObject;
import {ForeignKey} from "@/app/lib/dto/OpenApiExtensions";
import {
    Accordion,
    AccordionDetails,
    AccordionGroup,
    AccordionSummary,
    Box,
    FormControl,
    FormHelperText
} from "@mui/joy";
import Card from "@mui/joy/Card";
import Typography from "@mui/joy/Typography";
import CardContent from "@mui/joy/CardContent";
import Button from "@mui/joy/Button";
import {ApiSpecSelect} from "@/app/components/select/ApiSpecSelect";
import {useApiContext} from "@/app/hooks/useApiContext";
import {SchemaSelect} from "@/app/components/select/SchemaSelect";
import LinearProgress from "@mui/joy/LinearProgress";
import {ForeignKeyInputPreview} from "@/app/components/foreign-keys/ForeignKeyInputPreview";
import {InfoAlert} from "@/app/components/alert/InfoAlert";
import {AutoFixHigh, Key} from "@mui/icons-material";
import {Monospace} from "@/app/components/typography/Monospace";
import {ButtonRow} from "@/app/components/button/ButtonRow";

export interface ForeignKeyConfigurerModalProps {
    open: boolean
    onClose: () => void
    source: React.ReactNode
    inputWithoutForeignKeyPreview: React.ReactNode
    foreignKey?: ForeignKey
    onForeignKeySelected: (foreignKey: ForeignKey) => void
    onDelete: () => void
    readOnly: boolean
    foreignKeyIcon: React.ReactNode
}


export const ForeignKeyConfigurerModal = ({
                                              open,
                                              onClose,
                                              source,
                                              inputWithoutForeignKeyPreview,
                                              foreignKey,
                                              onForeignKeySelected,
                                              onDelete,
                                              readOnly,
                                              foreignKeyIcon,
                                          }: ForeignKeyConfigurerModalProps) => {

    const [apiSpecId, setApiSpecId] = useState<string | undefined>(foreignKey?.apiSpecId);
    const {data: apiContext, error, isLoading} = useApiContext(apiSpecId);
    const [selectedSchemaRef, setSelectedSchemaRef] = useState<string | undefined>(foreignKey?.schemaRef);
    const [selectedPropertyName, setSelectedPropertyName] = useState<string | undefined | null>(foreignKey?.propertyName);

    const getProperties = (): string[] => {
        if (!apiContext || !selectedSchemaRef) {
            return [];
        }

        try {
            const schema = getSchemaByRef(selectedSchemaRef, apiContext.apiSpec.document);

            const propertyNames: string[] = [];

            for (const propertyName in schema.properties) {
                const property = schema.properties[propertyName] as ReferenceObject | SchemaObject;

                if (!property.hasOwnProperty("$ref")) {
                    const propertySchemaObject = property as ArraySchemaObject | NonArraySchemaObject;

                    if (propertySchemaObject.type !== "object" && propertySchemaObject.type !== "array") {
                        propertyNames.push(propertyName);
                    }
                }
            }

            return propertyNames;
        } catch (error: any) {
            return [];
        }
    }

    const properties = getProperties();

    const onSave = () => {
        if (apiSpecId && selectedSchemaRef && selectedPropertyName) {
            onForeignKeySelected({
                apiSpecId: apiSpecId,
                schemaRef: selectedSchemaRef,
                propertyName: selectedPropertyName
            });
        }
    }

    const currentForeignKey: ForeignKey | undefined = (apiSpecId && selectedSchemaRef && selectedPropertyName)
        ? {
            apiSpecId: apiSpecId,
            schemaRef: selectedSchemaRef,
            propertyName: selectedPropertyName
        }
        : undefined;

    return (
        <ResponsiveModal open={open} onClose={onClose}>
            <Typography level="h1" sx={{mb: 2}}><Typography><Key/></Typography> Foreign Key Configuration</Typography>
            <Card variant="soft">
                <Typography level="title-lg">Source</Typography>
                <CardContent>
                    {source}
                </CardContent>
            </Card>
            <Card sx={{mt: 2}}>
                <div>
                    <Typography level="title-lg">Target</Typography>
                    <CardContent>
                        <FormControl>
                            <FormHelperText>API</FormHelperText>
                            <ApiSpecSelect
                                defaultApiSpecId={apiSpecId}
                                onApiSpecSelected={apiSpec => {
                                    setApiSpecId(apiSpec?.id);
                                    setSelectedSchemaRef(undefined);
                                    setSelectedPropertyName(undefined);
                                }}/>
                        </FormControl>
                        <FormControl>
                            <FormHelperText>Schema</FormHelperText>
                            {apiContext
                                ? <SchemaSelect
                                    defaultSchemaRef={selectedSchemaRef}
                                    onSchemaRefSelected={schemaRef => setSelectedSchemaRef(schemaRef)}
                                    schemaPredicate={schemaRef => schemaIsOutput(schemaRef, apiContext.apiSpec)}
                                    apiContext={apiContext}/>
                                : <Box><LinearProgress/></Box>}
                        </FormControl>
                        <FormControl>
                            <FormHelperText>Property</FormHelperText>
                            <Select
                                value={selectedPropertyName}
                                onChange={(event, value) => setSelectedPropertyName(value)}
                                disabled={readOnly || !selectedSchemaRef}
                                renderValue={option => {
                                    return option && <Monospace>{option.value}</Monospace>
                                }}>
                                {properties.map(propertyName => {
                                    return (
                                        <Option key={'option' + propertyName}
                                                value={propertyName}><Monospace>{propertyName}</Monospace></Option>
                                    );
                                })}
                            </Select>
                        </FormControl>
                    </CardContent>
                </div>
            </Card>
            {currentForeignKey && <Card variant="soft" sx={{mt: 2}}>
                <Typography level="title-lg">Configuration result preview</Typography>
                {currentForeignKey && <AccordionGroup variant="outlined">
                    <Accordion>
                        <AccordionSummary>
                            <Typography level="title-md"><Typography><AutoFixHigh/>
                            </Typography> User Input Improvement</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <InfoAlert title="This foreign key will improve the way HopFront asks the user for values."
                                       sx={{mt: 1, mb: 2,}}>
                                <Typography>Bellow is a <Typography variant="outlined"
                                                                    color="warning">before</Typography>/<Typography
                                    variant="outlined" color="success">after</Typography> visualization of how HopFront
                                    improves the
                                    input showed to the user as a result of the configured foreign key.</Typography>
                            </InfoAlert>
                            <Card sx={{mb: 2}}>
                                <Typography>
                                    <Typography level="body-sm" variant="outlined" color="warning">Without foreign
                                        key</Typography>
                                </Typography>
                                {inputWithoutForeignKeyPreview}
                            </Card>
                            <Card>
                                <Typography>
                                    <Typography level="body-sm" variant="outlined" color="success">With foreign
                                        key</Typography>
                                </Typography>
                                <ForeignKeyInputPreview foreignKeys={[currentForeignKey]}
                                                        foreignKeyIcon={foreignKeyIcon}/>
                            </Card>
                        </AccordionDetails>
                    </Accordion>
                </AccordionGroup>}
            </Card>}
            <ButtonRow align="right" sx={{mt: 2}}>
                <Button
                    onClick={onSave}
                    disabled={readOnly || !apiContext || !currentForeignKey}>Save</Button>
                <Button
                    color="danger"
                    variant="outlined"
                    onClick={() => {
                        onDelete();
                        setApiSpecId(undefined);
                        setSelectedSchemaRef(undefined)
                        setSelectedPropertyName(undefined);
                    }}
                    disabled={readOnly}>Delete</Button>
            </ButtonRow>
        </ResponsiveModal>
    );
}
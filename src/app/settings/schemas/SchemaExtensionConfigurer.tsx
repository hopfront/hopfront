import {InfoAlert} from "@/app/components/alert/InfoAlert";
import {ForeignKeyConfigurer} from "@/app/components/foreign-keys/ForeignKeyConfigurer";
import {SchemaFormControlInput} from "@/app/components/input/SchemaFormControlInput";
import {InfoTooltipIcon} from "@/app/components/misc/InfoTooltipIcon";
import {Monospace} from "@/app/components/typography/Monospace";
import {EventType, useSnackbar} from "@/app/hooks/useSnackbar";
import {ExtensionApi} from "@/app/lib/api/ExtensionApi";
import {PropertyExtension, SchemaExtension} from "@/app/lib/dto/OpenApiExtensions";
import {ApiContext} from "@/app/lib/model/ApiContext";
import {
    getPropertiesFromSchema,
    getSchemaByRef,
    getSchemaExtension,
    schemaIsInput,
    schemaRefToHumanLabel
} from "@/app/lib/openapi/utils";
import {SchemaPropertyExtensionLabelInput} from "@/app/settings/schemas/SchemaPropertyExtensionLabelInput";
import {SchemaPropertyVisibilitySelect} from "@/app/settings/schemas/SchemaPropertyVisibilitySelect";
import {FormControl} from "@mui/joy";
import Box from "@mui/joy/Box";
import FormHelperText from "@mui/joy/FormHelperText";
import Table from "@mui/joy/Table";
import Typography from "@mui/joy/Typography";
import React, {useEffect, useState} from "react";
import {useDebouncedCallback} from "use-debounce";
import Select from "@mui/joy/Select";
import Option from "@mui/joy/Option";

export interface SchemaExtensionConfigurerProps {
    schemaRef: string
    readOnly: boolean
    apiContext: ApiContext
}

const getPropertyExtension = (propertyName: string, schemaExtension: SchemaExtension): PropertyExtension => {
    return schemaExtension.properties.find(pe => pe.propertyName === propertyName) || {
        propertyName: propertyName,
        foreignKeys: [],
    };
}

export const SchemaExtensionConfigurer = ({
                                              schemaRef,
                                              readOnly,
                                              apiContext
                                          }: SchemaExtensionConfigurerProps) => {

    const [updating, setUpdating] = useState(false);
    const [schemaExtension, setSchemaExtension] = useState<SchemaExtension>(getSchemaExtension(schemaRef, apiContext));
    const {showSnackbar, Snackbar} = useSnackbar();

    useEffect(() => {
        setSchemaExtension(getSchemaExtension(schemaRef, apiContext));
    }, [apiContext, schemaRef]);

    const onPropertyExtensionChange = useDebouncedCallback((propertyExtension: PropertyExtension) => {
        setUpdating(true);

        const existingPropertyExtension = schemaExtension.properties.find(pe => pe.propertyName === propertyExtension.propertyName);

        if (existingPropertyExtension) {
            schemaExtension.properties = schemaExtension.properties
                .map(pe => pe.propertyName === propertyExtension.propertyName ? propertyExtension : pe);
        } else {
            schemaExtension.properties.push(propertyExtension);
        }

        setSchemaExtension({...schemaExtension});

        ExtensionApi.updateExtensionSchema(apiContext.apiSpec.id, schemaExtension)
            .then(() => {
                showSnackbar(EventType.Success, 'Configuration updated successfully');
                setUpdating(false);
            })
            .catch(reason => {
                showSnackbar(EventType.Error, `Failed to update configuration: ${reason.toLocaleString()}`);
                setUpdating(false);
            });
    }, 500);

    const schemaObject = getSchemaByRef(schemaRef, apiContext.apiSpec.document);
    const schemaProperties = getPropertiesFromSchema(schemaObject, apiContext.apiSpec.document);

    const propertyNames: string[] = [];

    for (const schemaPropertyName in schemaProperties) {
        propertyNames.push(schemaPropertyName);
    }

    const canHaveForeignKeys = schemaIsInput(schemaRef, apiContext.apiSpec);
    const schemaHumanLabel = schemaRefToHumanLabel(schemaRef);

    return (
        <>
            <Typography level="title-lg" sx={{mb: 1}}>
                <Typography>Schema Label </Typography>
                <Monospace level="body-sm">({schemaHumanLabel})</Monospace>
            </Typography>

            <FormControl sx={{mb: 4}}>
                <Select
                    value={schemaExtension.labelProperty}
                    disabled={updating}
                    onChange={(event, value) => {
                        if (value) {
                            setUpdating(true);

                            const updatedSchemaExtension = {...schemaExtension, labelProperty: value};
                            setSchemaExtension(updatedSchemaExtension);

                            ExtensionApi.updateExtensionSchema(apiContext.apiSpec.id, updatedSchemaExtension)
                                .then(() => {
                                    showSnackbar(EventType.Success, 'Configuration updated successfully');
                                    setUpdating(false);
                                })
                                .catch(reason => {
                                    showSnackbar(EventType.Error, `Failed to update configuration: ${reason.toLocaleString()}`);
                                    setUpdating(false);
                                });
                        }
                    }}>
                    {propertyNames.map(propertyName => (
                        <Option key={propertyName} value={propertyName}>{propertyName}</Option>
                    ))}
                </Select>
                <FormHelperText>The property that will be displayed when an object of type {schemaHumanLabel} needs to
                    be summarized.</FormHelperText>
            </FormControl>

            <Typography level="title-lg" sx={{mb: 2}}>
                <Typography>Schema Properties </Typography>
                <Monospace level="body-sm">({schemaHumanLabel})</Monospace>
            </Typography>

            {!canHaveForeignKeys && <InfoAlert
                title="This schema is never used as an input and thus Foreign Key configuration is not available.">
            </InfoAlert>}
            <Table sx={{
                mb: 2,
            }}>
                <thead>
                <tr>
                    <th><Typography>Name</Typography></th>
                    <th><Typography>Visibility</Typography></th>
                    {canHaveForeignKeys && <th>
                        <Typography>Foreign Keys
                            <Typography sx={{ml: 1}}>
                                <InfoTooltipIcon>
                                    <Typography>Foreign Keys help HopFront build a smarter UI.</Typography><br/>
                                    <Typography>You can think of them as the equivalent of Foreign Keys from Relational
                                        Database,
                                        except here the relationships are between Schemas instead of
                                        Tables.</Typography><br/>
                                    <Typography>For example, the property <Monospace>petId</Monospace> of a
                                        schema <Monospace>PetOrder</Monospace> would have a Foreign Key
                                        to the property <Monospace>id</Monospace> of a
                                        schema <Monospace>Pet</Monospace>. You could say that
                                        that <Monospace>Pet.id</Monospace> is a {'"Data Source"'}
                                        for <Monospace>PetOrder.petId</Monospace></Typography>
                                </InfoTooltipIcon>
                            </Typography>
                        </Typography>
                    </th>}
                </tr>
                </thead>
                <tbody>
                {propertyNames.map(propertyName => {
                    const propertyExtension = getPropertyExtension(propertyName, schemaExtension);

                    const source = (
                        <>
                            <FormControl>
                                <FormHelperText>Schema</FormHelperText>
                                <Monospace>{schemaHumanLabel}</Monospace>
                            </FormControl>

                            <FormControl>
                                <FormHelperText>Property</FormHelperText>
                                <Monospace>{propertyExtension.label || propertyExtension.propertyName}</Monospace>
                            </FormControl>
                        </>
                    );

                    const inputWithoutForeignKeyPreview = <SchemaFormControlInput
                        updatableValue={{
                            value: undefined,
                            onValueUpdate: () => null
                        }}
                        label={propertyExtension.label || propertyExtension.propertyName}
                        foreignKeys={[]}
                        apiContext={apiContext}/>

                    return (
                        <tr key={propertyExtension.propertyName}>
                            <td>
                                <SchemaPropertyExtensionLabelInput
                                    propertyExtension={propertyExtension}
                                    onLabelChange={label => {
                                        propertyExtension.label = label;
                                        onPropertyExtensionChange(propertyExtension);
                                    }}
                                    disabled={readOnly || updating}/>
                            </td>
                            <td>
                                <SchemaPropertyVisibilitySelect
                                    value={propertyExtension.visibility || "everywhere"}
                                    onVisibilityChange={visibility => {
                                        propertyExtension.visibility = visibility;
                                        onPropertyExtensionChange(propertyExtension);
                                    }}
                                    disabled={readOnly || updating}/>
                            </td>
                            {canHaveForeignKeys && <td>
                                {propertyExtension.foreignKeys.map((foreignKey, foreignKeyIndex) => (
                                    <Box sx={{mb: 1}} key={foreignKey.schemaRef + foreignKey.propertyName}>
                                        <ForeignKeyConfigurer
                                            source={source}
                                            inputWithoutForeignKeyPreview={inputWithoutForeignKeyPreview}
                                            foreignKey={foreignKey}
                                            onForeignKeySelected={selectedForeignKey => {
                                                propertyExtension.foreignKeys[foreignKeyIndex] = selectedForeignKey;
                                                onPropertyExtensionChange(propertyExtension);
                                            }}
                                            onDelete={() => {
                                                propertyExtension.foreignKeys = propertyExtension.foreignKeys
                                                    .flatMap(fk =>
                                                        fk.schemaRef === foreignKey.schemaRef && fk.propertyName === foreignKey.propertyName
                                                            ? []
                                                            : [fk]);
                                                onPropertyExtensionChange(propertyExtension);
                                            }}
                                            readOnly={readOnly || updating}/>
                                    </Box>
                                ))}
                                <div>
                                    <ForeignKeyConfigurer
                                        key="add"
                                        source={source}
                                        inputWithoutForeignKeyPreview={inputWithoutForeignKeyPreview}
                                        foreignKey={undefined}
                                        onForeignKeySelected={selectedForeignKey => {
                                            propertyExtension.foreignKeys.push(selectedForeignKey);
                                            onPropertyExtensionChange(propertyExtension);
                                        }}
                                        onDelete={() => null}
                                        readOnly={readOnly || updating}/>
                                </div>
                            </td>}
                        </tr>
                    )
                })}
                </tbody>
            </Table>
            {Snackbar}
        </>
    );
}
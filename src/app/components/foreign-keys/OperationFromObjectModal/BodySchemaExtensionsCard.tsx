import Typography from "@mui/joy/Typography";
import {Monospace} from "@/app/components/typography/Monospace";
import {SchemaRefSelect} from "@/app/components/select/SchemaRefSelect";
import Table from "@mui/joy/Table";
import {SchemaRefLabel} from "@/app/settings/schemas/SchemaRefLabel";
import {SchemaProperty} from "@/app/components/foreign-keys/SchemaPropertyPicker/SchemaPropertyPicker";
import {Box, Button, IconButton, Stack} from "@mui/joy";
import {SchemaPropertyLabel} from "@/app/settings/schemas/SchemaPropertyLabel";
import {SampleValue} from "@/app/components/misc/SampleValue";
import {Add, Delete} from "@mui/icons-material";
import {SchemaPropertyMapping, SchemaPropertyMappingModal} from "@/app/components/foreign-keys/SchemaPropertyMappingModal";
import Card from "@mui/joy/Card";
import React, {useEffect, useMemo, useState} from "react";
import {
    getReferenceObjectOrUndefined,
    getRequestBodyDefinitions, getSchemaByRef, uniqueFilter
} from "@/app/lib/openapi/utils";
import {StandaloneOperation} from "@/app/lib/model/StandaloneOperation";
import {ApiContext} from "@/app/lib/model/ApiContext";
import {SchemaExtension} from "@/app/lib/dto/OpenApiExtensions";

export interface BodySchemaExtensionsCardProps {
    sampleObject: any
    sampleObjectSchemaRef: string
    operation: StandaloneOperation
    onSchemaExtensionSelected: (schemaExtensions: SchemaExtension[]) => void
    disabled: boolean
    apiContext: ApiContext
}

export const BodySchemaExtensionsCard = ({sampleObject, sampleObjectSchemaRef, operation, onSchemaExtensionSelected, disabled, apiContext}: BodySchemaExtensionsCardProps) => {
    const requestBodyDefinitions = operation && getRequestBodyDefinitions(operation.operation);

    const sampleObjectSchema = getSchemaByRef(sampleObjectSchemaRef, apiContext.apiSpec.document);

    const bodySchemaRefs = useMemo(() => requestBodyDefinitions
            ? requestBodyDefinitions
                .flatMap(rbd => {
                    const rbdSchemaReferenceObject = getReferenceObjectOrUndefined(rbd.schema);
                    if (rbdSchemaReferenceObject) {
                        return [rbdSchemaReferenceObject.$ref];
                    } else {
                        return [];
                    }
                })
                .filter((value, index, array) => array.indexOf(value) === index)
            : []
        , [requestBodyDefinitions]);

    const [bodyPropertyMappings, setBodyPropertyMappings] = useState<SchemaPropertyMapping[]>([]);
    const [selectedBodySchemaRef, setSelectedBodySchemaRef] = useState<string | undefined>(bodySchemaRefs.length > 0 ? bodySchemaRefs[0] : undefined);
    const [showPropertyMappingModal, setShowPropertyMappingModal] = useState(false);

    useEffect(() => {
        if (bodySchemaRefs.length === 1) {
            setSelectedBodySchemaRef(bodySchemaRefs[0]);
        }
    }, [bodySchemaRefs]);

    if (bodySchemaRefs.length === 0) {
        return null;
    }

    const updateBodyPropertyMappings = (newBodyPropertyMappings: SchemaPropertyMapping[]) => {
        setBodyPropertyMappings(newBodyPropertyMappings);

        const targetSchemaRefs = newBodyPropertyMappings
            .map(bpm => bpm.target.schemaRef)
            .filter(uniqueFilter);

        const schemaExtensions = targetSchemaRefs.map(targetSchemaRef => {
            const targetSchemaRefPropertyMappings = newBodyPropertyMappings
                .flatMap(spm => spm.target.schemaRef === targetSchemaRef ? [spm] : []);

            const targetSchemaRefPropertyNames = targetSchemaRefPropertyMappings
                .map(m => m.target.propertyName)
                .filter(uniqueFilter);

            return {
                schemaRef: targetSchemaRef,
                properties: targetSchemaRefPropertyNames.flatMap(targetSchemaRefPropertyName => {
                    return {
                        propertyName: targetSchemaRefPropertyName,
                        foreignKeys: targetSchemaRefPropertyMappings.flatMap(mapping => {
                            return mapping.target.propertyName === targetSchemaRefPropertyName
                                ? [{
                                    schemaRef: mapping.source.schemaRef,
                                    propertyName: mapping.source.propertyName,
                                    apiSpecId: apiContext.apiSpec.id
                                }]
                                : [];
                        })
                    }
                })
            } as SchemaExtension;
        });

        onSchemaExtensionSelected(schemaExtensions);
    };

    return (
        <Card>
            <Typography level="title-sm"><Monospace>Body</Monospace></Typography>
            <SchemaRefSelect
                value={selectedBodySchemaRef}
                schemaRefs={bodySchemaRefs}
                onChange={schemaRef => setSelectedBodySchemaRef(schemaRef)}/>
            {selectedBodySchemaRef && <>
                {bodyPropertyMappings.length > 0 && <Table sx={{
                    '& thead th:nth-child(3)': {width: '5%'},
                }}>
                    <thead>
                    <tr>
                        <th><Typography>Source object property <Typography level="body-xs">(<SchemaRefLabel
                            schemaRef={sampleObjectSchemaRef}/>)</Typography></Typography></th>
                        <th><Typography>Target body property {selectedBodySchemaRef &&
                            <Typography level="body-xs">(<SchemaRefLabel
                                schemaRef={selectedBodySchemaRef}/>)</Typography>}</Typography></th>
                        <th></th>
                    </tr>
                    </thead>
                    <tbody>
                    {bodyPropertyMappings.map(bodyMappedProperty => {
                        const propertyKey = (property: SchemaProperty): string => {
                            return property.schemaRef + property.propertyName;
                        }

                        const key = propertyKey(bodyMappedProperty.source) + propertyKey(bodyMappedProperty.target);

                        return (
                            <tr key={key}>
                                <td>
                                    <Stack direction="row">
                                        <SchemaPropertyLabel
                                            schemaRef={bodyMappedProperty.source.schemaRef}
                                            propertyName={bodyMappedProperty.source.propertyName}/>
                                        <Stack justifyContent="center">
                                            <Typography level="body-xs"><SampleValue
                                                sampleObject={sampleObject}
                                                sampleObjectSchema={sampleObjectSchema}
                                                schemaProperty={bodyMappedProperty.source}
                                                apiContext={apiContext}/></Typography>
                                        </Stack>
                                    </Stack>
                                </td>
                                <td>
                                    <SchemaPropertyLabel
                                        schemaRef={bodyMappedProperty.target.schemaRef}
                                        propertyName={bodyMappedProperty.target.propertyName}/>
                                </td>
                                <td>
                                    <IconButton disabled={disabled} color="danger" onClick={() => {
                                        const newBodyPropertyMappings = bodyPropertyMappings.flatMap(m => {
                                            if (m.source.schemaRef === bodyMappedProperty.source.schemaRef &&
                                                m.source.propertyName === bodyMappedProperty.source.propertyName &&
                                                m.target.schemaRef === bodyMappedProperty.target.schemaRef &&
                                                m.target.propertyName === bodyMappedProperty.target.propertyName) {
                                                return [];
                                            } else {
                                                return [m];
                                            }
                                        });

                                        updateBodyPropertyMappings(newBodyPropertyMappings);
                                    }}>
                                        <Delete/>
                                    </IconButton>
                                </td>
                            </tr>
                        );
                    })}
                    </tbody>
                </Table>}
            </>}
            {selectedBodySchemaRef && <Box>
                <Button
                    disabled={disabled}
                    variant="outlined"
                    startDecorator={<Add/>}
                    onClick={() => setShowPropertyMappingModal(true)}
                >
                    Add body value mapping
                </Button>
                {(selectedBodySchemaRef) && <SchemaPropertyMappingModal
                    open={showPropertyMappingModal}
                    onClose={() => setShowPropertyMappingModal(false)}
                    sourceSchemaRef={sampleObjectSchemaRef}
                    targetSchemaRef={selectedBodySchemaRef}
                    onMappingDone={newMapping => {
                        setShowPropertyMappingModal(false);
                        bodyPropertyMappings.push(newMapping);
                        updateBodyPropertyMappings(bodyPropertyMappings);
                    }}
                    apiSpec={operation.apiSpec}/>}
            </Box>}
        </Card>
    );
}
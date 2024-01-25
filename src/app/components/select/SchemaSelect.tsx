import { ResponsiveModal } from "@/app/components/modal/ResponsiveModal";
import { OperationLabel } from "@/app/components/typography/OperationLabel";
import { ApiSpec } from "@/app/lib/dto/ApiSpec";
import { ApiContext } from "@/app/lib/model/ApiContext";
import { SchemaOperationRelationship } from "@/app/lib/model/SchemaOperationRelationship";
import {
    buildSchemaRef,
    getRequestBodyDefinitions, getResponseBodyDefinitions,
    getStandaloneOperations,
    schemaRefToHumanLabel
} from "@/app/lib/openapi/utils";
import { Search, UnfoldMore } from "@mui/icons-material";
import { Box, Button, Input, List, ListDivider, ListItem, ListItemButton, ListItemContent, Stack } from "@mui/joy";
import Typography from "@mui/joy/Typography";
import { SxProps } from "@mui/joy/styles/types";
import { OpenAPIV3 } from "openapi-types";
import { useEffect, useState } from "react";
import ReferenceObject = OpenAPIV3.ReferenceObject;

const getSchemaRefs = (document: OpenAPIV3.Document): string[] => {
    const schemaRefs: string[] = [];

    if (!document) {
        console.log('Document should have a value, this should not happen. This is here for resilience purposes.');
        return [];
    }

    for (const schemaName in document.components?.schemas) {
        schemaRefs.push(buildSchemaRef(schemaName));
    }

    return schemaRefs;
}


const findSchemaOperationRelationships = (schemaRef: string, apiSpec: ApiSpec): SchemaOperationRelationship[] => {
    return getStandaloneOperations(apiSpec)
        .map(operation => {
            const isRequestBody = !!getRequestBodyDefinitions(operation.operation)
                .find(rbd => {
                    if (!rbd.schema) {
                        return false;
                    }

                    if (rbd.schema.hasOwnProperty("$ref")) {
                        return (rbd.schema as ReferenceObject).$ref === schemaRef;
                    } else {
                        return false;
                    }
                });

            const isResponseBody = !!getResponseBodyDefinitions(operation.operation).find(rbd => {
                if (!rbd.schema) {
                    return false;
                }

                if (rbd.schema.hasOwnProperty("$ref")) {
                    return (rbd.schema as ReferenceObject).$ref === schemaRef;
                } else {
                    return false;
                }
            });


            return {
                operation: operation,
                isRequestBody: isRequestBody,
                isResponseBody: isResponseBody
            } as SchemaOperationRelationship;
        })
}


export interface SchemaSelectProps {
    defaultSchemaRef?: string
    onSchemaRefSelected: (schemaRef: string) => void
    schemaPredicate?: (schemaRef: string) => boolean
    disabled?: boolean
    apiContext: ApiContext
    sx?: SxProps
}

export const SchemaSelect = ({ defaultSchemaRef, onSchemaRefSelected, schemaPredicate, disabled = false, apiContext, sx }: SchemaSelectProps) => {
    const [open, setOpen] = useState(false);
    const [searchInput, setSearchInput] = useState<string | undefined>();
    const [selectedSchemaRef, setSelectedSchemaRef] = useState<string | undefined>(defaultSchemaRef);
    const schemaRefs = getSchemaRefs(apiContext.apiSpec.document)
        .filter(schemaRef => schemaPredicate === undefined || schemaPredicate(schemaRef));

    useEffect(() => {
        if (schemaRefs.length > 0) {
            const firstSchema = schemaRefs[0];

            if (selectedSchemaRef) {
                const existingSelectedSchemaRef = schemaRefs.find(sr => sr === selectedSchemaRef);

                if (!existingSelectedSchemaRef) {
                    setSelectedSchemaRef(firstSchema);
                    onSchemaRefSelected(firstSchema);
                }
            } else {
                setSelectedSchemaRef(firstSchema);
                onSchemaRefSelected(firstSchema);
            }
        }

        schemaRefs.sort((a, b) => a.localeCompare(b));
    }, [schemaRefs, selectedSchemaRef, setSelectedSchemaRef, onSchemaRefSelected])

    return (
        <Box sx={sx}>
            <Button
                variant="outlined"
                color="neutral"
                onClick={() => setOpen(true)}
                disabled={disabled}
                endDecorator={<UnfoldMore />}>
                {selectedSchemaRef
                    ? <Typography fontFamily="monospace"
                        fontWeight={1}>{schemaRefToHumanLabel(selectedSchemaRef)}</Typography>
                    : <Typography>Select a schema...</Typography>
                }
            </Button>
            <ResponsiveModal open={open} onClose={() => setOpen(false)}>
                <Input
                    autoFocus
                    value={searchInput}
                    onChange={event => setSearchInput(event.currentTarget.value)}
                    type="text"
                    endDecorator={<Search />}
                    placeholder="Search a schema..." />
                <List>
                    {schemaRefs.flatMap(sr => {
                        const schemaOperationRelationships = findSchemaOperationRelationships(sr, apiContext.apiSpec);
                        const schemaHumanLabel = schemaRefToHumanLabel(sr);

                        if (searchInput) {
                            const schemaLabelContainsSearch = schemaHumanLabel.toLowerCase().indexOf(searchInput.toLowerCase()) >= 0;

                            // const operationContainsSearch = schemaOperationRelationships
                            //     .filter(rel => {
                            //         const pathContainsSearch = rel.operation.path.toLowerCase().indexOf(searchInput.toLowerCase()) >= 0;
                            //         const summaryContainsSearch = rel.operation.operation.summary && rel.operation.operation.summary.toLowerCase().indexOf(searchInput.toLowerCase()) >= 0;
                            //         const descriptionContainsSearch = rel.operation.operation.description && rel.operation.operation.description.toLowerCase().indexOf(searchInput.toLowerCase()) >= 0;
                            //         return pathContainsSearch || summaryContainsSearch || descriptionContainsSearch;
                            //     })
                            //     .length > 0;

                            if (!schemaLabelContainsSearch) {
                                return [];
                            }
                        }

                        return [(
                            <>
                                <ListItem key={sr}>
                                    <ListItemButton onClick={() => {
                                        setSelectedSchemaRef(sr)
                                        onSchemaRefSelected(sr);
                                        setOpen(false);
                                    }}>
                                        <ListItemContent>
                                            <Typography fontFamily="monospace">{schemaHumanLabel}</Typography>

                                            <ul>
                                                {schemaOperationRelationships
                                                    .filter(rel => rel.isRequestBody || rel.isResponseBody)
                                                    .map(rel => {
                                                        return (
                                                            <li key={sr + rel.operation.getOperationId()}>
                                                                <Stack
                                                                    direction="row">

                                                                    {rel.isRequestBody &&
                                                                        <Typography level="body-xs"
                                                                            fontFamily="monospace"
                                                                            variant="outlined">{schemaHumanLabel} (in)
                                                                            →</Typography>}
                                                                    <Typography level="body-xs" variant="plain"
                                                                        sx={{ ml: 1, mr: 1 }}>
                                                                        <OperationLabel operation={rel.operation}
                                                                            mode="technical" />
                                                                    </Typography>
                                                                    {rel.isResponseBody &&
                                                                        <Typography level="body-xs"
                                                                            fontFamily="monospace"
                                                                            variant="outlined">→ {schemaHumanLabel} (out)</Typography>}
                                                                </Stack>
                                                            </li>
                                                        );
                                                    })}
                                            </ul>
                                        </ListItemContent>
                                    </ListItemButton>
                                </ListItem>
                                <ListDivider inset="gutter" />
                            </>

                        )];
                    })}
                </List>
            </ResponsiveModal>
        </Box>
    );
}
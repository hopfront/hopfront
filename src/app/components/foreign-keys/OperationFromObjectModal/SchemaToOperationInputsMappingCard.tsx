import Typography from "@mui/joy/Typography";
import {Stack} from "@mui/joy";
import {SchemaRefLabel} from "@/app/settings/schemas/SchemaRefLabel";
import {OperationLabel} from "@/app/components/typography/OperationLabel";
import Card from "@mui/joy/Card";
import React from "react";
import {StandaloneOperation} from "@/app/lib/model/StandaloneOperation";
import {ParameterExtension, SchemaExtension} from "@/app/lib/dto/OpenApiExtensions";
import {ApiContext, SchemaOrReference} from "@/app/lib/model/ApiContext";

import {ParameterExtensionsCard} from "@/app/components/foreign-keys/OperationFromObjectModal/ParameterExtensionsCard";
import {BodySchemaExtensionsCard} from "@/app/components/foreign-keys/OperationFromObjectModal/BodySchemaExtensionsCard";

export interface SchemaToOperationInputsMappingCardProps {
    sampleObject: any
    objectSchema: SchemaOrReference
    schemaRef: string
    operation: StandaloneOperation
    onParameterExtensionsSelected: (parameterExtensions: ParameterExtension[]) => void
    onSchemaExtensionSelected: (schemaExtensions: SchemaExtension[]) => void
    disabled: boolean
    apiContext: ApiContext
}

export const SchemaToOperationInputsMappingCard = ({
                                                       sampleObject,
                                                       objectSchema,
                                                       schemaRef,
                                                       operation,
                                                       onParameterExtensionsSelected,
                                                       onSchemaExtensionSelected,
                                                       disabled,
                                                       apiContext
                                                   }: SchemaToOperationInputsMappingCardProps) => {


    return (
        <Card sx={{mt: 2}}>
            <Typography level="title-md">
                <Stack direction="row">
                    <Stack justifyContent="center">
                        <Typography>3. How should <Typography variant="outlined"><SchemaRefLabel
                            schemaRef={schemaRef}/></Typography> values
                            be mapped to the inputs of</Typography>
                    </Stack>
                    <Typography variant="outlined" sx={{ml: 1}}>
                        <OperationLabel operation={operation} mode="technical"/>
                    </Typography>
                    <Typography>?</Typography>
                </Stack>
            </Typography>

            <Typography level="body-sm">
                <Stack direction="row">
                    <Typography>Here you have to configure how HopFront maps values from an object of type
                        {' "'}<SchemaRefLabel schemaRef={schemaRef}/>{'" '}
                        to the inputs of the selected operation
                    </Typography>

                    <Typography>.</Typography>
                </Stack>
            </Typography>

            <ParameterExtensionsCard
                operation={operation}
                sampleObject={sampleObject}
                objectSchema={objectSchema}
                onParameterExtensionsSelected={onParameterExtensionsSelected}
                disabled={disabled}
                apiContext={apiContext}/>

            <BodySchemaExtensionsCard
                sampleObject={sampleObject}
                sampleObjectSchemaRef={schemaRef}
                operation={operation}
                onSchemaExtensionSelected={onSchemaExtensionSelected}
                disabled={disabled}
                apiContext={apiContext}/>
        </Card>
    );
}
import Typography from "@mui/joy/Typography";
import {SchemaRefLabel} from "@/app/settings/schemas/SchemaRefLabel";
import Card from "@mui/joy/Card";
import React from "react";

export interface SelectedObjectSchemaCardProps {
    schemaRef: string
}

export const SelectedObjectSchemaCard = ({schemaRef}: SelectedObjectSchemaCardProps) => {
    return (
        <Card variant="soft" sx={{mt: 2}}>
            <Typography level="title-md">
                1. Which object (or parts of it) should be used as an input for the operation?
            </Typography>
            <Typography>
                <Typography level="body-lg" variant="outlined">
                    <SchemaRefLabel schemaRef={schemaRef}/>
                </Typography>
            </Typography>
        </Card>
    );
}
import {StandaloneOperation} from "@/app/lib/model/StandaloneOperation";
import {OpenAPIV3} from "openapi-types";
import ParameterObject = OpenAPIV3.ParameterObject;
import Typography from "@mui/joy/Typography";
import {OperationLabel} from "@/app/components/typography/OperationLabel";
import React from "react";
import {Stack} from "@mui/joy";

export interface OperationParameterLabelProps {
    operation: StandaloneOperation
    parameter: ParameterObject
}

export const OperationParameterLabel = ({operation, parameter}: OperationParameterLabelProps) => {
    return (
        <Stack direction="row">
            <Typography><Typography variant="outlined" fontFamily="monospace">{parameter.name} →</Typography></Typography>
            <Typography><OperationLabel operation={operation} mode="human"/></Typography>
        </Stack>
    );
}
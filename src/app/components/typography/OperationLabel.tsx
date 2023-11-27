import { StandaloneOperation } from "@/app/lib/model/StandaloneOperation";
import { Box, Stack, Typography } from "@mui/joy";
import React from "react";
import { OverridableStringUnion } from "@mui/types";
import { ColorPaletteProp, TypographySystem } from "@mui/joy/styles/types";
import { TypographyPropsColorOverrides } from "@mui/joy/Typography/TypographyProps";
import { OpenAPIV3 } from "openapi-types";
import HttpMethods = OpenAPIV3.HttpMethods;

const httpMethodColor = (method: HttpMethods): OverridableStringUnion<ColorPaletteProp, TypographyPropsColorOverrides> => {
    switch (method) {
        case HttpMethods.GET:
            return "primary";
        case HttpMethods.PUT:
            return "warning";
        case HttpMethods.POST:
            return "success";
        case HttpMethods.DELETE:
            return "danger";
        default:
            return "neutral";
    }
}

export interface OperationTypographyProps {
    operation: StandaloneOperation
    mode: "human" | "technical",
    level?: keyof TypographySystem | undefined,
    alignPaths?: boolean
}

const technicalTypography = (
    operation: StandaloneOperation,
    level: keyof TypographySystem | undefined,
    alignPaths?: boolean
) => {
    return (
        <Typography>
            <Typography component='span'
                fontFamily="monospace"
                marginRight={1}
                noWrap
                overflow='visible'
                width={alignPaths ? 60 : undefined}
                color={httpMethodColor(operation.method)}
                level={level}
                fontWeight='bold'>
                {operation.method.toUpperCase()}
            </Typography>
            <Typography component='span' noWrap overflow='visible' fontFamily="monospace" level={level}>
                {operation.path}
            </Typography>
        </Typography>
    );
};


export const OperationLabel = ({ operation, mode, alignPaths = false, level }: OperationTypographyProps) => {
    if (!operation) {
        return <Typography noWrap level={level}>???</Typography>; // this should never happen, but hey TypeScript.
    }

    switch (mode) {
        case "technical": {
            return technicalTypography(operation, level, alignPaths);
        }
        case "human": {
            if (operation.operation.summary) {
                return <Typography noWrap level={level}>{operation.operation.summary}</Typography>;
            } else {
                return technicalTypography(operation, level, alignPaths);
            }
        }
        default: {
            return technicalTypography(operation, level, alignPaths);
        }
    }
}
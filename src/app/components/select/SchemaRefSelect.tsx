import {Monospace} from "@/app/components/typography/Monospace";
import {Option, Select} from "@mui/joy";
import * as React from "react";
import {SxProps} from "@mui/joy/styles/types";
import {schemaRefTuHumanLabel} from "@/app/lib/openapi/utils";

export interface MonospaceSelectProps {
    schemaRefs: string[]
    value?: string
    onChange: (schemaRef: string | undefined) => void
    disabled?: boolean
    sx?: SxProps
}

export const SchemaRefSelect = ({value, schemaRefs, onChange, disabled = false, sx}: MonospaceSelectProps) => {
    return (
        <Select
            disabled={disabled || (!!value && schemaRefs.length === 1)}
            value={value}
            onChange={(_, value) => {
                const newValue = value === null ? undefined : value;
                onChange(newValue);
            }}
            renderValue={option => option && <Monospace>{schemaRefTuHumanLabel(option.value)}</Monospace>}
            sx={sx}>
            {schemaRefs.sort((a, b) => a.localeCompare(b)).map(value =>
                <Option
                    key={value}
                    value={value}>
                    <Monospace>{schemaRefTuHumanLabel(value)}</Monospace>
                </Option>)}
        </Select>
    );
}
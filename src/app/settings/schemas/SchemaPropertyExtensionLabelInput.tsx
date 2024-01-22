import { ManualInput } from "@/app/components/input/ManualInput";
import React, { useState } from "react";
import { PropertyExtension } from "@/app/lib/dto/OpenApiExtensions";
import FormControl from "@mui/joy/FormControl";
import FormLabel from "@mui/joy/FormLabel";
import { Typography } from "@mui/joy";

export interface SchemaPropertyExtensionLabelInputProps {
    propertyExtension: PropertyExtension
    onLabelChange: (label: string) => void
    disabled: boolean
}

export const SchemaPropertyExtensionLabelInput = ({
    propertyExtension,
    onLabelChange,
    disabled
}: SchemaPropertyExtensionLabelInputProps) => {
    const [label, setLabel] = useState(propertyExtension.label || propertyExtension.propertyName);

    return (
        <FormControl disabled={disabled}>
            <FormLabel><Typography fontFamily="monospace" level="body-xs">{propertyExtension.propertyName}</Typography></FormLabel>
            <ManualInput
                disabled={disabled}
                type="text"
                defaultValue={label}
                placeholder={propertyExtension.propertyName}
                onChange={value => {
                    const newLabel = value as string;
                    setLabel(newLabel);
                    onLabelChange(newLabel);
                }} />
        </FormControl>
    )
}
import { Dropdown, IconButton, ListItemDecorator, Menu, MenuButton, MenuItem, SvgIcon } from "@mui/joy";
import Input from "@mui/joy/Input";
import React, { HTMLInputTypeAttribute, useRef, useState } from "react";
import { useDebouncedCallback } from "use-debounce";
import { InputMenu } from "@/app/components/input/InputMenu";

export type ManualInputValueType = string | ReadonlyArray<string> | number | undefined;

export interface ManualInputProps {
    type: HTMLInputTypeAttribute
    onChange: (value: ManualInputValueType) => void
    defaultValue?: ManualInputValueType
    placeholder?: string | undefined
    required?: boolean
    disabled?: boolean
    readOnly?: boolean
    debounceMillis?: number
    endDecorator?: React.ReactNode
    min?: number
    max?: number
    sx?: {}
}

export const ManualInput = ({
    type,
    defaultValue,
    placeholder,
    onChange,
    required,
    disabled,
    debounceMillis = 0,
    readOnly,
    endDecorator,
    min,
    max,
    sx,
}: ManualInputProps) => {

    const onInputChange = useDebouncedCallback(
        (event: React.ChangeEvent<HTMLInputElement>) => {
            onChange(event.target.value);
        },
        debounceMillis
    );

    return (
        <Input
            sx={{
                ...sx,
            }}
            type={type}
            defaultValue={defaultValue}
            placeholder={placeholder}
            required={required}
            endDecorator={endDecorator}
            disabled={disabled || readOnly}
            onChange={onInputChange}
            slotProps={{
                input: {
                    min: min,
                    max: max,
                }
            }}
            readOnly={readOnly} />
    )
}
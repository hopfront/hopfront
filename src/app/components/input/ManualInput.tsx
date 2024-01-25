import { UpdatableValue } from "@/app/lib/model/UpdatableValue";
import Input from "@mui/joy/Input";
import React, { HTMLInputTypeAttribute, useState } from "react";

export type ManualInputValueType = string | ReadonlyArray<string> | number | undefined;

export interface ManualInputProps {
    type: HTMLInputTypeAttribute
    onFocus?: React.FocusEventHandler
    onBlur?: React.FormEventHandler
    defaultValue?: ManualInputValueType
    updatableValue?: UpdatableValue<any>
    placeholder?: string | undefined
    required?: boolean
    disabled?: boolean
    readOnly?: boolean
    endDecorator?: React.ReactNode
    min?: number
    max?: number
    sx?: {}
}

export const ManualInput = ({
    type,
    defaultValue,
    updatableValue,
    placeholder,
    onFocus,
    onBlur,
    required,
    disabled,
    readOnly,
    endDecorator,
    min,
    max,
    sx,
}: ManualInputProps) => {
    const [value, setValue] = useState(updatableValue?.value);

    return (
        <Input
            sx={{
                ...sx,
            }}
            type={type}
            defaultValue={defaultValue}
            value={value}
            placeholder={placeholder}
            required={required}
            endDecorator={endDecorator}
            disabled={disabled || readOnly}
            onChange={(event) => {
                setValue(event.target.value);
                const sanitizedValue = type === "number" ? event.target.valueAsNumber : event.target.value;
                updatableValue?.onValueUpdate(sanitizedValue);
            }}
            onFocus={onFocus}
            onBlur={onBlur}
            slotProps={{
                input: {
                    min: min,
                    max: max,
                }
            }}
            readOnly={readOnly} />
    )
}
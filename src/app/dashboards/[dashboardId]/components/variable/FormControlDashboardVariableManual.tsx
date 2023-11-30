import {FormControl, FormLabel} from "@mui/joy";
import {ManualInput, ManualInputValueType} from "@/app/components/input/ManualInput";
import React from "react";
import {VariableWithValue} from "@/app/lib/model/dashboard/VariableWithValue";

export interface FormControlDashboardVariableManualProps {
    variable: VariableWithValue
    onValueChange: (value: string) => void
    cacheKey?: string
}

export const FormControlDashboardVariableManual = ({variable, onValueChange, cacheKey}: FormControlDashboardVariableManualProps) => {
    if (!variable.value && cacheKey) {
        const cachedValue = localStorage.getItem(cacheKey);

        if (cachedValue) {
            onValueChange(cachedValue);
            return null;
        }
    }

    const onTextChange = (value: ManualInputValueType) => {
        if (cacheKey) {
            localStorage.setItem(cacheKey, value as string);
        }

        onValueChange(value as string);
    };

    return (
        <FormControl>
            <FormLabel>{variable.variable.label || variable.variable.name}</FormLabel>
            <ManualInput
                type={variable.variable.type || 'text'}
                defaultValue={variable.value}
                debounceMillis={500}
                onChange={onTextChange}/>
        </FormControl>
    );
}
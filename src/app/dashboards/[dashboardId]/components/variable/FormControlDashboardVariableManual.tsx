import { ManualInput, ManualInputValueType } from "@/app/components/input/ManualInput";
import { VariableWithValue } from "@/app/lib/model/dashboard/VariableWithValue";
import { FormControl, FormLabel } from "@mui/joy";
import { useEffect } from "react";

export interface FormControlDashboardVariableManualProps {
    variable: VariableWithValue
    onValueChange: (value: string) => void
    cacheKey?: string
}

export const FormControlDashboardVariableManual = ({ variable, onValueChange, cacheKey }: FormControlDashboardVariableManualProps) => {
    useEffect(() => {
        if (!variable.value && cacheKey) {
            const cachedValue = localStorage.getItem(cacheKey);
            if (cachedValue) {
                onValueChange(cachedValue);
            }
        }
    }, [onValueChange, variable.value, cacheKey])

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
                defaultValue={variable.value}
                type={variable.variable.type || 'text'}
                updatableValue={{
                    value: variable.value,
                    onValueUpdate: (value) => onTextChange(value)
                }}
            />
        </FormControl>
    );
}
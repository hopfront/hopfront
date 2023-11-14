import {
    ApiAuthenticationConfig,
    ApiAuthenticationStaticParameterData,
    StaticParamLocation
} from "@/app/lib/dto/ApiAuthenticationConfig";
import { UpdatableValue } from "@/app/lib/model/UpdatableValue";
import { KeyboardArrowDown } from "@mui/icons-material";
import { Option, Select } from "@mui/joy";
import FormControl from "@mui/joy/FormControl";
import FormHelperText from "@mui/joy/FormHelperText";
import Input from "@mui/joy/Input";
import { useEffect, useMemo, useState } from "react";

export interface StaticAuthenticationFormProps {
    updateValue: UpdatableValue<ApiAuthenticationConfig>
    disabled: boolean
}

type FormData = {
    parameterName: string,
    parameterLocation: string
}

export default function StaticAuthConfigForm({ updateValue, disabled }: StaticAuthenticationFormProps) {
    const staticAuthData = updateValue.value?.data as ApiAuthenticationStaticParameterData | undefined;

    const initialValues = useMemo(() => {
        return {
            parameterName: staticAuthData?.parameterName ?? '',
            parameterLocation: staticAuthData?.parameterLocation ?? 'HEADER',
        } as FormData
    }, [updateValue.value]);

    const [formData, setFormData] = useState<FormData>(initialValues);

    useEffect(() => {
        setFormData(initialValues);
    }, [initialValues])

    useEffect(() => {
        const authentication = {
            authenticationType: "STATIC",
            data: {
                parameterName: formData.parameterName,
                parameterLocation: formData.parameterLocation,
            } as ApiAuthenticationStaticParameterData
        } as ApiAuthenticationConfig
        updateValue.onValueUpdate(authentication)
    }, [formData, updateValue])

    return (
        <>
            <FormControl>
                <FormHelperText>Add to</FormHelperText>
                <Select
                    onChange={(_, value) => {
                        const location = value ? value as StaticParamLocation : 'HEADER';
                        setFormData({ ...formData, parameterLocation: location });
                    }}
                    disabled={disabled}
                    indicator={<KeyboardArrowDown />}
                    value={formData.parameterLocation}
                    sx={{ width: '15%', minWidth: '250px', mt: 1 }}
                >
                    <Option value="HEADER">Header</Option>
                    <Option value="QUERY">Query</Option>
                </Select>
            </FormControl>
            <FormControl>
                <FormHelperText sx={{ width: '60px' }}>Name</FormHelperText>
                <Input
                    sx={{ mt: 1, width: '25%', minWidth: '350px' }}
                    onChange={(event) => {
                        setFormData({ ...formData, parameterName: event.target.value });
                    }}
                    name="custom_key"
                    placeholder="Authorization"
                    value={formData.parameterName}
                    required
                    disabled={disabled}
                />
            </FormControl>
        </>
    )
};
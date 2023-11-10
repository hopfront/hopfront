import { ApiSpec } from "@/app/lib/dto/ApiSpec";
import { useApiSpecs } from "@/app/hooks/useApiSpecs";
import {CircularProgress} from "@mui/joy";
import Option from "@mui/joy/Option";
import Select from "@mui/joy/Select";
import { useState } from "react";

export interface ApiSpecSelectProps {
    defaultApiSpecId?: string | undefined,
    isSelectionForced?: boolean,
    onApiSpecSelected: (apiSpec: ApiSpec | undefined) => void,
    disabled?: boolean
    sx?: {}
}

export const ApiSpecSelect = ({ onApiSpecSelected, isSelectionForced = true, defaultApiSpecId, disabled = false, sx }: ApiSpecSelectProps) => {
    const { data, error, isLoading } = useApiSpecs();
    const [apiSpecId, setApiSpecId] = useState<string | undefined | null>(defaultApiSpecId);

    if (isLoading) {
        return (
            <Select disabled endDecorator={<CircularProgress size="sm" />} sx={{ ...sx }} />
        );
    }

    if (!apiSpecId && isSelectionForced && data && data.apiSpecs.length > 0 && !apiSpecId) {
        const firstApiSpec = data.apiSpecs[0];
        setApiSpecId(firstApiSpec.id);
        onApiSpecSelected(firstApiSpec);
    }

    return (
        <Select
            disabled={disabled}
            value={apiSpecId ?? 'NO_OPTION'}
            onChange={(_, apiSpecId) => {
                const selectedApiSpec = data?.apiSpecs.find(spec => spec.id === apiSpecId);
                setApiSpecId(apiSpecId);
                onApiSpecSelected(selectedApiSpec);
            }}
            sx={{ ...sx }}>

            {!isSelectionForced &&
                <Option
                    key={'none'}
                    value={'NO_OPTION'}>
                    All APIs
                </Option>}
            {(data?.apiSpecs || []).map(apiSpec =>
                <Option key={apiSpec.id}
                    value={apiSpec.id}>
                    {apiSpec.document.info.title}
                </Option>)}
        </Select>
    );
}
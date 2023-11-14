import {StandaloneOperation} from "@/app/lib/model/StandaloneOperation";
import {Option, Select} from "@mui/joy";
import * as React from "react";
import Typography from "@mui/joy/Typography";
import {OverridableStringUnion} from "@mui/types";
import {ColorPaletteProp} from "@mui/joy/styles/types";
import {TypographyPropsColorOverrides} from "@mui/joy/Typography/TypographyProps";
import {Monospace} from "@/app/components/typography/Monospace";
import {useState} from "react";

interface StatusDetails {
    label: string
    color: OverridableStringUnion<ColorPaletteProp, TypographyPropsColorOverrides>
}

const STATUSES: Record<string, StatusDetails> = {
    '200': {
        label: 'OK',
        color: 'success'
    },
    '201': {
        label: 'Created',
        color: 'success'
    },
    '202': {
        label: 'Accepted',
        color: 'success'
    },
    '204': {
        label: 'No Content',
        color: 'success',
    },
    '400': {
        label: 'Bad Request',
        color: 'warning'
    },
    '401': {
        label: 'Unauthorized',
        color: 'warning'
    },
    '403': {
        label: 'Forbidden',
        color: 'warning'
    },
    '404': {
        label: 'Not Found',
        color: 'warning'
    },
    '405': {
        label: 'Method Not Allowed',
        color: 'warning'
    },
    '409': {
        label: 'Conflict',
        color: 'warning',
    },
    '500': {
        label: 'Internal Server Error',
        color: 'danger',
    }
}

const getResponseStatusOptions = (operation: StandaloneOperation | undefined): string[] => {
    return operation ? Object.keys(operation.operation.responses) : [];
};

export interface ResponseStatusSelectProps {
    defaultStatus?: string
    operation: StandaloneOperation
    disabled?: boolean
    onChange: (status: string) => void
}

const statusTypography = (status: string) => {
    const statusDetails = STATUSES.hasOwnProperty(status) ? STATUSES[status] : undefined;

    if (statusDetails) {
        const ml = 0.0001; // otherwise there is a display glitch

        return (
            <Typography color={statusDetails.color} sx={{ml: ml}}>
                <Monospace>{status}</Monospace>
                <Typography sx={{ml: 1}}>{statusDetails.label}</Typography>
            </Typography>
        );
    } else {
        return <Monospace>{status}</Monospace>;
    }
}

export const ResponseStatusSelect = ({defaultStatus, operation, disabled = false, onChange}: ResponseStatusSelectProps) => {
    const options = getResponseStatusOptions(operation);
    const [status, setStatus] = useState<string | undefined>(defaultStatus);

    const statusDetails = (status && STATUSES.hasOwnProperty(status)) ? STATUSES[status] : undefined;

    if (!defaultStatus && !status && options.length > 0) {
        setStatus(options[0]);
        onChange(options[0]);
    }

    return (
        <Select
            color={statusDetails?.color}
            defaultValue={status}
            onChange={(_, value) => {
                if (value) {
                    setStatus(value);
                    onChange(value);
                }
            }}
            disabled={disabled}
            renderValue={option => option && statusTypography(option.value)}
            sx={{minWidth: 250}}>
            {options.map(responseStatusOption =>
                <Option
                    key={responseStatusOption}
                    value={responseStatusOption}>
                    {statusTypography(responseStatusOption)}
                </Option>)}
        </Select>
    );
}
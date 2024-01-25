'use client'

import { useApiContext } from "@/app/hooks/useApiContext";
import { EventType, useSnackbar } from "@/app/hooks/useSnackbar";
import { ApiConfigApi } from "@/app/lib/api/ApiConfigApi";
import { CircularProgress, Stack, Switch, Typography } from "@mui/joy";
import { ChangeEvent, useEffect, useState } from "react";

type CorsSwitchProps = {
    apiSpecId: string,
    onSwitch?: (isChecked: boolean) => void,
    sx?: {}
}

export default function CORSSwitch({ apiSpecId, onSwitch, sx }: CorsSwitchProps) {
    const { data: context, error, isLoading: contextLoading } = useApiContext(apiSpecId);
    const [isCorsByPassed, setIsCorsByPassed] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const { showSnackbar, Snackbar } = useSnackbar();

    useEffect(() => {
        if (context?.config?.isCorsByPassed) {
            setIsCorsByPassed(context.config.isCorsByPassed);
        }
    }, [context])

    const handleCheckboxClick = (event: ChangeEvent<HTMLInputElement>) => {
        const isByPassed = event.target.checked;
        setIsCorsByPassed(isByPassed);
        setIsLoading(true);

        ApiConfigApi.saveApiConfig(apiSpecId, { isCorsByPassed: isByPassed })
            .then(() => {
                showSnackbar(EventType.Success, 'CORS configuration updated successfully');
                return onSwitch?.(isByPassed);
            })
            .catch(reason => showSnackbar(EventType.Error, `Failed to update CORS configuration: ${reason.toLocaleString()}`))
            .finally(() => setIsLoading(false));
    }

    return (
        <Stack display={'flex'} direction={'row'} gap={1} sx={{ ...sx }}>
            <Switch
                color={isCorsByPassed ? 'warning' : undefined}
                checked={isCorsByPassed}
                disabled={contextLoading || isLoading}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                    handleCheckboxClick(event)
                }
                slotProps={{
                    thumb: {
                        children: isLoading ? <CircularProgress size='sm' /> : undefined
                    }
                }}
            />
            <Typography level="body-sm" color="warning">
                Bypass browser CORS
            </Typography>
            {Snackbar}
        </Stack>
    )
}
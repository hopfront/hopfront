'use client'

import {useApiContext} from "@/app/hooks/useApiContext";
import {ApiConfigApi} from "@/app/lib/api/ApiConfigApi";
import {fetcher} from "@/app/lib/api/utils";
import {CircularProgress, Switch, Typography} from "@mui/joy";
import {ChangeEvent, useEffect, useState} from "react";
import useSWRMutation from 'swr/mutation';
import {EventType, useSnackbar} from "@/app/hooks/useSnackbar";

type CorsSwitchProps = {
    apiSpecId: string,
    onSwitch?: (isChecked: boolean) => void,
}

export default function CORSSwitch({ apiSpecId, onSwitch }: CorsSwitchProps) {
    const { data: context, error, isLoading: contextLoading } = useApiContext(apiSpecId);
    const { trigger } = useSWRMutation(`/api/api-specs/${apiSpecId}/context`, fetcher);
    const [isCorsByPassed, setIsCorsByPassed] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const {showSnackbar, Snackbar} = useSnackbar();

    useEffect(() => {
        if (context?.config?.isCorsByPassed) {
            setIsCorsByPassed(context.config.isCorsByPassed);
        }
    }, [context])

    const handleCheckboxClick = (event: ChangeEvent<HTMLInputElement>) => {
        const isByPassed = event.target.checked;
        setIsCorsByPassed(isByPassed);
        setIsLoading(true);

        ApiConfigApi.saveApiConfig(apiSpecId, {isCorsByPassed: isByPassed})
            .then(() => {
                showSnackbar(EventType.Success, 'CORS configuration updated successfully');
                return onSwitch?.(isByPassed);
            })
            .catch(reason => showSnackbar(EventType.Error, `Failed to update CORS configuration: ${reason.toLocaleString()}`))
            .finally(() => setIsLoading(false));
    }

    return (
        <>
            <Typography
                startDecorator={<Switch
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
                />}>
                Bypass browser CORS
            </Typography>
            {Snackbar}
        </>

    )
}
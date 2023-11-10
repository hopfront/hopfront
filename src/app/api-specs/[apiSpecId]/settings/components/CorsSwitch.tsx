'use client'

import { useApiContext } from "@/app/hooks/useApiContext";
import { ApiConfigApi } from "@/app/lib/api/ApiConfigApi";
import { fetcher } from "@/app/lib/api/utils";
import { CircularProgress, Switch, Typography } from "@mui/joy";
import { ChangeEvent, useEffect, useState } from "react";
import useSWRMutation from 'swr/mutation';

type CorsSwitchProps = {
    apiSpecId: string,
    onSwitch?: (isChecked: boolean) => void,
}

export default function CORSSwitch({ apiSpecId, onSwitch }: CorsSwitchProps) {
    const { data: context, error, isLoading: contextLoading } = useApiContext(apiSpecId);
    const { trigger } = useSWRMutation(`/api/api-specs/${apiSpecId}/context`, fetcher);
    const [isCorsByPassed, setIsCorsByPassed] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);

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
            .then(() => onSwitch?.(isByPassed))
            .finally(() => setIsLoading(false))
    }

    return (
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
    )
}
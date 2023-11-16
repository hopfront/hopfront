import { ServerSelect } from "@/app/api-specs/[apiSpecId]/settings/components/ServerSelect";
import { AuthenticationBadge } from "@/app/components/authentication/AuthenticationBadge";
import { OperationLabel } from "@/app/components/typography/OperationLabel";
import { ServerLocalStorage } from "@/app/lib/localstorage/ServerLocalStorage";
import { ApiContext } from "@/app/lib/model/ApiContext";
import { StandaloneOperation } from "@/app/lib/model/StandaloneOperation";
import { Box, Stack, Typography } from "@mui/joy";
import { useState } from "react";
import ReactMarkdown from "react-markdown";

interface OperationHeaderProps {
    operation: StandaloneOperation
    apiContext: ApiContext
}

export const OperationHeader = ({ operation, apiContext }: OperationHeaderProps) => {
    const [authenticationBadgeRefresher, setAuthenticationBadgeRefresher] = useState(0);
    const defaultServer = ServerLocalStorage.getApiServer(apiContext);
    const onServerSelected = () => {
        setAuthenticationBadgeRefresher((value) => value + 1);
    }
    return (
        <>
            <Box display='flex' flexDirection='row' justifyContent='space-between'>
                <Box>
                    <OperationLabel level="title-lg" operation={operation} mode="human" />
                    {operation.operation.description && operation.operation.description.toUpperCase() != operation.operation.summary?.toUpperCase() ? <Typography level="body-sm">
                        <ReactMarkdown>
                            {operation.operation.description || ''}
                        </ReactMarkdown>
                    </Typography> : <Box sx={{ mb: 4 }}></Box>}
                </Box>
                <div>
                    <Stack direction="row">
                        {defaultServer &&
                            <ServerSelect
                                defaultServer={defaultServer}
                                apiContext={apiContext}
                                onServerSelected={onServerSelected} />}
                        <Box sx={{ ml: 1 }}>
                            <AuthenticationBadge key={authenticationBadgeRefresher} apiContext={apiContext} />
                        </Box>
                    </Stack>
                </div>
            </Box>
        </>
    )
}
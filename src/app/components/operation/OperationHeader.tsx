'use client'

import { ServerSelect } from "@/app/api-specs/[apiSpecId]/settings/components/ServerSelect";
import { AuthenticationBadge } from "@/app/components/authentication/AuthenticationBadge";
import { OperationLabel } from "@/app/components/typography/OperationLabel";
import { ServerLocalStorage } from "@/app/lib/localstorage/ServerLocalStorage";
import { ApiContext } from "@/app/lib/model/ApiContext";
import { StandaloneOperation } from "@/app/lib/model/StandaloneOperation";
import { Warning } from "@mui/icons-material";
import { Box, Button, Stack, Typography } from "@mui/joy";
import { useRouter } from "next/navigation";
import { useState } from "react";
import ReactMarkdown from "react-markdown";
import { ResponsiveModal } from "../modal/ResponsiveModal";

interface OperationHeaderProps {
    operation: StandaloneOperation
    apiContext: ApiContext
}

export const OperationHeader = ({ operation, apiContext }: OperationHeaderProps) => {
    const [authenticationBadgeRefresher, setAuthenticationBadgeRefresher] = useState(0);
    const [modalOpen, setModalOpen] = useState(false);
    const defaultServer = ServerLocalStorage.getApiServer(apiContext);
    const router = useRouter();
    const onServerSelected = () => {
        setAuthenticationBadgeRefresher((value) => value + 1);
    }

    const onModalGoToSettingsClicked = () => {
        setModalOpen(false);
        router.push(`/api-specs/${apiContext.apiSpec.id}/settings`);
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
                        {!defaultServer &&
                            <Button
                                onClick={() => setModalOpen(true)}
                                color="danger"
                                variant="soft"
                                startDecorator={<Warning />}>
                                No server configured
                            </Button>}
                    </Stack>
                </div>
            </Box>

            <ResponsiveModal onClose={() => setModalOpen(false)} open={modalOpen}>
                <Box>
                    <Typography level="title-lg" gutterBottom>You should configure a valid default server</Typography>
                    <Typography>You need a valid default server (e.g., https://mybaseurl.com) to successfully send requests to this API.</Typography>
                    <Stack direction="row" sx={{ mt: 2 }} gap={1}>
                        <Button onClick={onModalGoToSettingsClicked}>
                            Go to settings
                        </Button>
                        <Button onClick={() => setModalOpen(false)} variant="outlined">
                            Cancel
                        </Button>
                    </Stack>
                </Box>
            </ResponsiveModal>
        </>
    )
}
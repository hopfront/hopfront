'use client';

import { ApiAuthConfigWidget } from "@/app/api-specs/[apiSpecId]/settings/components/ApiAuthConfigWidget";
import CorsSettings from "@/app/api-specs/[apiSpecId]/settings/components/CorsSettings";
import { ButtonRow } from "@/app/components/button/ButtonRow";
import { ResponsiveModal } from "@/app/components/modal/ResponsiveModal";
import { ErrorAlert } from "@/app/components/operation/response/ErrorAlert";
import { useAnalytics } from "@/app/hooks/analytics/useAnalytics";
import { useApiContext } from "@/app/hooks/useApiContext";
import { ApiSpecsApi } from "@/app/lib/api/ApiSpecsApi";
import { Problem } from "@/app/lib/dto/Problem";
import { ServerLocalStorage } from "@/app/lib/localstorage/ServerLocalStorage";
import {
    OperationsExtensionsConfigurerPage
} from "@/app/settings/operations/OperationExtensionsConfigurerPage";
import { SchemaExtensionsConfigurerPage } from "@/app/settings/schemas/SchemaExtensionsConfigurerPage";
import { Cloud, Dangerous, DataObject, KeyboardArrowRight, Lock, PlayCircle, Security } from "@mui/icons-material";
import {
    Accordion, AccordionDetails,
    AccordionGroup, AccordionSummary, Avatar,
    Box,
    Breadcrumbs,
    Button, Link,
    Skeleton,
    accordionSummaryClasses
} from "@mui/joy";
import ListItemContent from "@mui/joy/ListItemContent";
import Typography from "@mui/joy/Typography";
import { useParams, useRouter } from "next/navigation";
import React, { useState } from "react";
import ServerConfiguration from "./components/ServerConfiguration";

export default function Page() {
    const router = useRouter();
    const apiSpecId = decodeURIComponent(useParams()['apiSpecId'] as string);

    const { usePageView } = useAnalytics();
    const { data: apiContext, error, isLoading } = useApiContext(apiSpecId);

    const [openDeleteConfirmation, setOpenDeleteConfirmation] = useState(false);
    const [deleteApiLoading, setDeleteApiLoading] = useState(false);
    const [deleteError, setDeleteError] = useState<Problem | undefined>();

    usePageView("api-spec-settings-page");

    if (error) {
        return (
            <ErrorAlert
                error={error}
                onClose={() => router.push('/settings')}
            />
        )
    } else {
        const document = apiContext?.apiSpec.document;
        const title = (document?.info.title) || 'Untitled API';
        const defaultServer = document && ServerLocalStorage.getApiServer(apiContext);

        return (
            <>
                <Breadcrumbs separator={<KeyboardArrowRight />} sx={{ p: 0 }}>
                    <Link href='/settings' color='neutral'>
                        HopFront Settings
                    </Link>
                    <Typography><Skeleton loading={!apiContext}>{title}</Skeleton></Typography>
                </Breadcrumbs>

                <Typography level='h1' gutterBottom sx={{ mt: 1 }}><Skeleton
                    loading={!apiContext}>{title}</Skeleton></Typography>

                <AccordionGroup sx={{
                    [`& .${accordionSummaryClasses.button}`]: {
                        paddingBlock: '1rem',
                    },
                }}>
                    <Accordion>
                        <AccordionSummary>
                            <Avatar color="primary">
                                <Cloud />
                            </Avatar>
                            <ListItemContent>
                                <Typography level="title-lg">Servers</Typography>
                                <Typography level="body-sm">
                                    The servers implementing this API specification.
                                </Typography>
                            </ListItemContent>
                        </AccordionSummary>
                        <AccordionDetails>
                            {apiContext && <ServerConfiguration apiContext={apiContext} defaultServer={defaultServer} sx={{ mt: 1 }} />}
                        </AccordionDetails>
                    </Accordion>
                    <Accordion>
                        <AccordionSummary>
                            <Avatar color="primary">
                                <DataObject />
                            </Avatar>
                            <ListItemContent>
                                <Typography level="title-lg">Schemas</Typography>
                                <Typography level="body-sm">
                                    Configure the Schemas (Models) exposed by the API.
                                </Typography>
                            </ListItemContent>
                        </AccordionSummary>
                        <AccordionDetails>
                            {apiContext &&
                                <Box sx={{ mt: 2 }}>
                                    <SchemaExtensionsConfigurerPage apiContext={apiContext} readOnly={false} />
                                </Box>}
                        </AccordionDetails>
                    </Accordion>
                    <Accordion>
                        <AccordionSummary>
                            <Avatar color="primary">
                                <PlayCircle />
                            </Avatar>
                            <ListItemContent>
                                <Typography level="title-lg">Operations</Typography>
                                <Typography level="body-sm">
                                    Configure the Operations (HTTP requests) exposed by the API.
                                </Typography>
                            </ListItemContent>
                        </AccordionSummary>
                        <AccordionDetails>
                            {apiContext &&
                                <Box sx={{ mt: 2 }}>
                                    <OperationsExtensionsConfigurerPage apiContext={apiContext} readOnly={false} />
                                </Box>}
                        </AccordionDetails>
                    </Accordion>
                    <Accordion>
                        <AccordionSummary>
                            <Avatar color="warning">
                                <Lock />
                            </Avatar>
                            <ListItemContent>
                                <Typography level="title-lg">Authentication</Typography>
                                <Typography level="body-sm">
                                    Configure how users should authenticate to the API.
                                </Typography>
                            </ListItemContent>
                        </AccordionSummary>
                        <AccordionDetails>
                            {(apiSpecId && apiContext) &&
                                <Box sx={{ mt: 2 }}>
                                    <ApiAuthConfigWidget
                                        key={apiSpecId}
                                        apiContext={apiContext}
                                    />
                                </Box>}
                        </AccordionDetails>
                    </Accordion>
                    <Accordion>
                        <AccordionSummary>
                            <Avatar color="warning">
                                <Security />
                            </Avatar>
                            <ListItemContent>
                                <Typography level="title-lg">Cross-Origin Resource Sharing (CORS)</Typography>
                                <Typography level="body-sm">
                                    Configure the CORS policy.
                                </Typography>
                            </ListItemContent>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Box sx={{ mt: 2 }}>
                                <CorsSettings specId={apiSpecId} />
                            </Box>
                        </AccordionDetails>
                    </Accordion>
                    <Accordion>
                        <AccordionSummary>
                            <Avatar color="danger">
                                <Dangerous />
                            </Avatar>
                            <ListItemContent>
                                <Typography level="title-lg">Danger Zone</Typography>
                                <Typography level="body-sm">
                                    Be careful what you wish for.
                                </Typography>
                            </ListItemContent>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Box sx={{ mt: 2 }}>
                                <Typography level="body-md">Delete this API</Typography>
                                <Button
                                    onClick={() => setOpenDeleteConfirmation(true)}
                                    color='danger'
                                    sx={{ alignSelf: 'flex-start', mt: 0 }}>
                                    Delete
                                </Button>
                                <ResponsiveModal
                                    aria-labelledby="close-modal-title"
                                    open={openDeleteConfirmation}
                                    onClose={(_event: React.MouseEvent<HTMLButtonElement>, reason: string) => {
                                        setOpenDeleteConfirmation(false);
                                    }}
                                >
                                    <Box>
                                        <Typography level='h3'>
                                            Are you sure you want to delete this
                                            API?</Typography>
                                        <Typography level='body-md'>This action cannot be undone.</Typography>
                                        <ButtonRow align="right">
                                            <Button
                                                loading={deleteApiLoading}
                                                color="danger"
                                                onClick={() => {
                                                    setDeleteError(undefined);
                                                    setDeleteApiLoading(true);
                                                    ApiSpecsApi.deleteApiSpec(apiSpecId)
                                                        .then(response => {
                                                            if (response.status >= 200 && response.status < 300) {
                                                                router.push('/settings');
                                                            } else {
                                                                setDeleteApiLoading(false);
                                                                setDeleteError({
                                                                    title: 'We cannot delete your api specification',
                                                                    detail: '',
                                                                    status: response.status
                                                                });
                                                            }
                                                        })
                                                }}
                                                sx={{ mt: 2 }}>
                                                Delete
                                            </Button>
                                        </ButtonRow>
                                        {deleteError && <ErrorAlert error={deleteError} />}
                                    </Box>
                                </ResponsiveModal>
                            </Box>
                        </AccordionDetails>
                    </Accordion>
                </AccordionGroup>
            </>
        );
    }
}
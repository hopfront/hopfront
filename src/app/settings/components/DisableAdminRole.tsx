'use client';

import { InfoAlert } from "@/app/components/alert/InfoAlert";
import { ProblemAlert } from "@/app/components/alert/ProblemAlert";
import { WarningAlert } from "@/app/components/alert/WarningAlert";
import { ResponsiveModal } from "@/app/components/modal/ResponsiveModal";
import { InstanceApi } from "@/app/lib/api/InstanceApi";
import { Problem } from "@/app/lib/dto/Problem";
import { Stack } from "@mui/joy";
import Box from "@mui/joy/Box";
import Button from "@mui/joy/Button";
import Typography from "@mui/joy/Typography";
import { useState } from "react";

export const DisableAdminRole = () => {
    const [disableAdminRoleModalOpen, setDisableAdminRoleModalOpen] = useState(false);
    const [submitAdminStatusError, setSubmitAdminStatusError] = useState<Problem | undefined>();
    const [isSubmitAdminStatusLoading, setIsSubmitAdminStatusLoading] = useState(false);

    const onDisableAdminRole = () => {
        InstanceApi.logoutAdmin()
            .then(async (response) => {
                if (response.ok) {
                    setDisableAdminRoleModalOpen(false);
                    return;
                }

                let errorMessage = 'An unknown error occurred';
                try {
                    const errorData = await response.json();
                    errorMessage = errorData.message || errorData.detail || JSON.stringify(errorData)
                } catch (e) {
                    console.log('Error parsing admin status error', e);
                }

                setSubmitAdminStatusError({
                    title: 'We failed to disable your admin role',
                    status: response.status,
                    detail: errorMessage
                })
            }).finally(() => {
                setIsSubmitAdminStatusLoading(false);
            })
    }

    return (
        <Box sx={{ mt: 1 }}>
            <Box>
                <InfoAlert title={''}>
                    <Typography>
                        You are currently logged in as an administrator. <br />
                        You can add or modify API specifications, dashboards and operations.
                    </Typography>
                </InfoAlert>
                <Stack direction={'row'} gap={1}>
                    <Button
                        color='danger'
                        sx={{ mt: 1 }}
                        onClick={() => {
                            setDisableAdminRoleModalOpen(true);
                        }}>
                        Disable administrator role
                    </Button>
                    <Button variant="outlined" sx={{ mt: 1 }}>
                        Reset password
                    </Button>
                </Stack>
            </Box>
            <ResponsiveModal open={disableAdminRoleModalOpen} onClose={() => setDisableAdminRoleModalOpen(false)}>
                <Box>
                    <Typography level='h3'>Disable administrator role</Typography>
                    <WarningAlert title={''}>
                        <Typography level='body-sm' sx={{ mt: 1 }}>
                            As soon as you disable the administrator role, every user will be able to add, modify or delete API specifications, dashboards and operations.
                        </Typography>
                    </WarningAlert>
                    <Stack direction='row' gap={1} sx={{ mt: 3 }}>
                        <Button
                            color='danger'
                            onClick={() => {
                                setDisableAdminRoleModalOpen(false);
                                onDisableAdminRole();
                            }}
                            loading={isSubmitAdminStatusLoading}>
                            Disable administrator role
                        </Button>
                        <Button
                            variant='outlined'
                            onClick={() => {
                                setDisableAdminRoleModalOpen(false);
                            }}>
                            Cancel
                        </Button>
                    </Stack>
                    {submitAdminStatusError &&
                        <ProblemAlert
                            problem={submitAdminStatusError}
                            onClose={() => setSubmitAdminStatusError(undefined)}
                        />
                    }
                </Box>
            </ResponsiveModal>
        </Box>);
}
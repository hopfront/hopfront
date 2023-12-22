'use client';

import { InfoAlert } from "@/app/components/alert/InfoAlert";
import { mutateAdminInfo } from "@/app/hooks/useAdminInfo";
import { InstanceApi } from "@/app/lib/api/InstanceApi";
import { Problem } from "@/app/lib/dto/Problem";
import { Stack } from "@mui/joy";
import Box from "@mui/joy/Box";
import Button from "@mui/joy/Button";
import Typography from "@mui/joy/Typography";
import { useState } from "react";
import { DisableAdminRoleModal } from "./DisableAdminRoleModal";

export const AdminRoleEnabledState = () => {
    const [disableAdminRoleModalOpen, setDisableAdminRoleModalOpen] = useState(false);
    const [submitAdminStatusError, setSubmitAdminStatusError] = useState<Problem | undefined>();
    const [isSubmitAdminStatusLoading, setIsSubmitAdminStatusLoading] = useState(false);

    const onDisableAdminRole = () => {
        InstanceApi.disableAdminRole()
            .then(async (response) => {
                if (response.ok) {
                    mutateAdminInfo();
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
            <DisableAdminRoleModal
                open={disableAdminRoleModalOpen}
                loading={isSubmitAdminStatusLoading}
                error={submitAdminStatusError}
                onDisableClicked={onDisableAdminRole}
                onDismissError={() => { setSubmitAdminStatusError(undefined) }}
                onClose={() => { setDisableAdminRoleModalOpen(false); }} />
        </Box>);
}
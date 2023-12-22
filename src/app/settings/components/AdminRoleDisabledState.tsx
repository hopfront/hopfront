'use client';

import { InfoAlert } from "@/app/components/alert/InfoAlert";
import { ProblemAlert } from "@/app/components/alert/ProblemAlert";
import { WarningAlert } from "@/app/components/alert/WarningAlert";
import { ResponsiveModal } from "@/app/components/modal/ResponsiveModal";
import { InstanceApi } from "@/app/lib/api/InstanceApi";
import { Problem } from "@/app/lib/dto/Problem";
import { AdminPanelSettings, East } from "@mui/icons-material";
import { FormControl, FormLabel, Input, Stack } from "@mui/joy";
import Box from "@mui/joy/Box";
import Button from "@mui/joy/Button";
import Typography from "@mui/joy/Typography";
import { useState } from "react";

export const AdminRoleDisabledState = () => {
    const [enableAdminRoleModalOpen, setEnableAdminRoleModalOpen] = useState(false);
    const [adminPassword, setAdminPassword] = useState<string>('');
    const [isSubmitAdminStatusLoading, setIsSubmitAdminStatusLoading] = useState(false);
    const [submitAdminStatusError, setSubmitAdminStatusError] = useState<Problem | undefined>();

    const onSubmitAdminRoleEnabled = (e: React.MouseEvent<HTMLFormElement>) => {
        e.preventDefault();

        const password = adminPassword.trim();
        if (password === '') {
            setIsSubmitAdminStatusLoading(false);
            setSubmitAdminStatusError({
                title: 'Your password should not be empty (or composed only of spaces)',
                status: -1
            })
            return;
        }

        InstanceApi.updateAdminPassword({ password: adminPassword })
            .then(async (response) => {
                if (response.ok) {
                    setEnableAdminRoleModalOpen(false);
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
                    title: 'We failed to activate admin role',
                    status: response.status,
                    detail: errorMessage
                })
            }).finally(() => {
                setIsSubmitAdminStatusLoading(false);
            })

    }

    return (
        <Box sx={{ mt: 1 }}>
            <InfoAlert>
                <Typography>
                    When enabled the admin role solely permits the administrator to add or modify API specifications, dashboards and operations. <br />
                    Every other users will only have read access and use predefined operations.
                </Typography>
            </InfoAlert>
            <Button sx={{ mt: 1 }} onClick={() => setEnableAdminRoleModalOpen(true)}>
                Activate administrator role
            </Button>
            <ResponsiveModal open={enableAdminRoleModalOpen} onClose={() => setEnableAdminRoleModalOpen(false)}>
                <Box>
                    <Typography level='h3'>Activate administrator role</Typography>
                    <form
                        onSubmit={onSubmitAdminRoleEnabled}
                        style={{ marginTop: '18px' }}>
                        <FormControl>
                            <FormLabel>
                                Password<Typography level="body-xs" color="danger">*</Typography>
                            </FormLabel>
                            <Input
                                value={adminPassword}
                                onChange={(e) => setAdminPassword(e.target.value)}
                                type="password"
                                required
                                placeholder="Password"
                            />
                        </FormControl>
                        <WarningAlert title={''}>
                            <Typography>
                                Keep your password safe as you will not be able to reset it later.
                            </Typography>
                        </WarningAlert>


                        <Box
                            display={'flex'}
                            sx={{
                                justifyContent: 'center',
                                p: 1,
                                mt: 3,
                                borderRadius: '8px',
                                borderStyle: 'solid',
                                borderWidth: '1px',
                                borderColor: 'var(--joy-palette-primary-500)'
                            }}>
                            <Box sx={{ width: '50%' }}>
                                <Stack direction={'row'} justifyContent={'space-around'}>
                                    <Stack>
                                        <AdminPanelSettings sx={{ alignSelf: 'center' }} />
                                        <Typography level="body-sm">User</Typography>
                                    </Stack>
                                    <East sx={{ alignSelf: 'center' }} />
                                    <Stack>
                                        <AdminPanelSettings color="primary" sx={{ alignSelf: 'center' }} />
                                        <Typography level="body-sm" color="primary">Administrator</Typography>
                                    </Stack>
                                </Stack>
                            </Box>
                        </Box>
                        <Typography level="title-sm" fontWeight={'400'} sx={{ mt: 1, textAlign: 'center' }}>
                            Keep track of your administrator status from HopFront side bar.
                        </Typography>

                        <Stack direction='row' gap={1} sx={{ mt: 3 }}>
                            <Button type='submit' loading={isSubmitAdminStatusLoading} disabled={isSubmitAdminStatusLoading}>
                                Activate administrator role
                            </Button>
                            <Button
                                variant='outlined'
                                onClick={() => {
                                    setEnableAdminRoleModalOpen(false);
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
                    </form>
                </Box>
            </ResponsiveModal>
        </Box>
    )
}
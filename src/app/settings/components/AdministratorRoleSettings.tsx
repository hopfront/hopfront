'use client';

import { InfoAlert } from "@/app/components/alert/InfoAlert";
import { ProblemAlert } from "@/app/components/alert/ProblemAlert";
import { WarningAlert } from "@/app/components/alert/WarningAlert";
import { ResponsiveModal } from "@/app/components/modal/ResponsiveModal";
import { ErrorAlert } from "@/app/components/operation/response/ErrorAlert";
import useAdministratorStatus, { mutateAdministratorStatus } from "@/app/hooks/useAdministratorStatus";
import { InstanceApi } from "@/app/lib/api/InstanceApi";
import { Problem } from "@/app/lib/dto/Problem";
import { InstanceAdminStatus } from "@/app/lib/model/InstanceAdminStatus";
import { AdminPanelSettings, East } from "@mui/icons-material";
import { FormControl, FormLabel, Input, LinearProgress, Stack } from "@mui/joy";
import Box from "@mui/joy/Box";
import Button from "@mui/joy/Button";
import Typography from "@mui/joy/Typography";
import { useEffect, useState } from "react";

export default function AdministratorRoleSettings() {
    const { data: adminStatus, isLoading: isAdminStatusLoading, error: adminStatusError } = useAdministratorStatus();
    const [enableAdminRoleModalOpen, setEnableAdminRoleModalOpen] = useState(false);
    const [disableAdminRoleModalOpen, setDisableAdminRoleModalOpen] = useState(false);
    const [isAdminRoleEnabled, setIsAdminRoleEnabled] = useState<boolean | undefined>();
    const [isAdminStatusEditable, setIsAdminStatusEditable] = useState<boolean>(adminStatus?.isEditable ?? true)
    const [adminPassword, setAdminPassword] = useState<string>('');
    const [isSubmitAdminStatusLoading, setIsSubmitAdminStatusLoading] = useState(false);
    const [submitAdminStatusError, setSubmitAdminStatusError] = useState<Problem | undefined>();

    useEffect(() => {
        if (adminStatus) {
            setIsAdminRoleEnabled(!!adminStatus.password && adminStatus.password.length > 0);
        }
    }, [adminStatus]);

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

        if (!adminStatus) {
            setIsSubmitAdminStatusLoading(false);
            setSubmitAdminStatusError({
                title: 'We failed to activate admin role',
                detail: 'Impossible to retrieve admin status data',
                status: -1
            })
            return;
        }

        sendAdminStatusRequest({
            ...adminStatus,
            password: adminPassword
        })
    }

    const onDisableAdminRole = () => {
        if (!adminStatus) {
            setIsSubmitAdminStatusLoading(false);
            setSubmitAdminStatusError({
                title: 'We failed to deactivate admin role',
                detail: 'Impossible to retrieve admin status data',
                status: -1
            })
            return;
        }
        sendAdminStatusRequest({
            ...adminStatus,
            password: undefined
        })
    }

    const sendAdminStatusRequest = (body: InstanceAdminStatus) => {
        setIsSubmitAdminStatusLoading(true);
        setSubmitAdminStatusError(undefined);

        InstanceApi.saveAdministratorStatus(body)
            .then(async (response) => {
                if (response.status >= 400) {
                    let errorMessage = 'Unknown error occurred';
                    try {
                        const errorData = await response.json();
                        errorMessage = errorData.message || errorData.detail || JSON.stringify(errorData)
                    } catch (e) {
                        console.log('Error parsing admin status error', e);
                    }

                    setSubmitAdminStatusError({
                        title: 'We failed to update admin role',
                        status: response.status,
                        detail: errorMessage
                    })
                } else {
                    setEnableAdminRoleModalOpen(false);
                    setDisableAdminRoleModalOpen(false);
                }
            }).finally(() => {
                setIsSubmitAdminStatusLoading(false);
                mutateAdministratorStatus();
            })
    }

    if (isAdminStatusLoading) {
        console.log("isloading")
        return <LinearProgress sx={{ mt: 2 }} />;
    }

    if (adminStatusError) {
        console.log("got error")
        return <ErrorAlert error={adminStatusError} />
    }

    console.log("got data :", adminStatus)
    return (
        <Box>
            {!isAdminRoleEnabled ?
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
                                        Yes, activate administrator role
                                    </Button>
                                    <Button
                                        variant='outlined'
                                        onClick={() => {
                                            setEnableAdminRoleModalOpen(false);
                                            onDisableAdminRole();
                                        }}>
                                        No, cancel
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
                :
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
                                Deactivate administrator role
                            </Button>
                            <Button variant="outlined" sx={{ mt: 1 }}>
                                Reset password
                            </Button>
                        </Stack>
                    </Box>
                    <ResponsiveModal open={disableAdminRoleModalOpen} onClose={() => setDisableAdminRoleModalOpen(false)}>
                        <Box>
                            <Typography level='h3'>Deactivate administrator role</Typography>
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
                                    Yes, deactivate administrator role
                                </Button>
                                <Button
                                    variant='outlined'
                                    onClick={() => {
                                        setDisableAdminRoleModalOpen(false);
                                    }}>
                                    No, cancel
                                </Button>
                            </Stack>
                        </Box>
                    </ResponsiveModal>
                </Box>}
        </Box>
    );
}
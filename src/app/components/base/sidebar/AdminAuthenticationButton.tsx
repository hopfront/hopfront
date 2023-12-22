'use client'

import { mutateAdminInfo } from "@/app/hooks/useAdminInfo";
import { InstanceApi } from "@/app/lib/api/InstanceApi";
import { Problem } from "@/app/lib/dto/Problem";
import { AdminAuthRequest } from "@/app/lib/dto/admin/auth/AdminAuthRequest";
import { AdminPanelSettings } from "@mui/icons-material";
import { Button, FormControl, FormLabel, IconButton, Input, Stack, Typography } from "@mui/joy";
import { ChangeEvent, useState } from "react";
import { ProblemAlert } from "../../alert/ProblemAlert";
import { ResponsiveModal } from "../../modal/ResponsiveModal";
import { extractErrorMessage } from "@/app/lib/api/utils";

interface AdminAuthenticationButtonProps {
    isAuthenticated: boolean
}

export const AdminAuthenticationButton = ({ isAuthenticated }: AdminAuthenticationButtonProps) => {
    const [adminPassword, setAdminPassword] = useState<string>('');
    const [isAuthenticationLoading, setIsAuthenticationLoading] = useState<boolean>(false);
    const [showAdminAuthentication, setShowAdminAuthentication] = useState<boolean>(false);
    const [authenticationError, setAuthenticationError] = useState<Problem | undefined>();

    const onSubmitAdminAuthentication = (event: ChangeEvent<HTMLFormElement>) => {
        event.preventDefault();

        setIsAuthenticationLoading(true);
        setAuthenticationError(undefined);

        InstanceApi.authenticateAdmin({ password: adminPassword } as AdminAuthRequest)
            .then(async (res) => {
                if (res.ok) {
                    mutateAdminInfo();
                    setShowAdminAuthentication(false);
                } else {
                    setAuthenticationError({
                        title: 'Login has failed',
                        status: res.status,
                        detail: await extractErrorMessage(res)
                    })
                }
            })
            .catch((e) => {
                setAuthenticationError({ title: 'An unknown error occurred', status: -1, detail: e?.message } as Problem)
            })
            .finally(() => {
                setIsAuthenticationLoading(false);
            })
    }

    return (
        <>
            <IconButton
                title="Admin role"
                variant="outlined"
                color={isAuthenticated ? 'primary' : 'neutral'}
                onClick={() => setShowAdminAuthentication(true)}>
                <AdminPanelSettings />
            </IconButton>
            <ResponsiveModal onClose={() => setShowAdminAuthentication(false)} open={showAdminAuthentication}>
                <Typography level="title-lg">Admin authentication</Typography>
                <form
                    onSubmit={onSubmitAdminAuthentication}
                    style={{ marginTop: '18px' }}>
                    <FormControl>
                        <FormLabel>
                            Password<Typography level="body-xs" color="danger">*</Typography>
                        </FormLabel>
                        <Stack direction={'row'} gap={1}>
                            <Input
                                sx={{ flexGrow: 1 }}
                                value={adminPassword}
                                onChange={(e) => setAdminPassword(e.target.value)}
                                type="password"
                                required
                                placeholder="Password"
                            />
                            <Button
                                type="submit"
                                loading={isAuthenticationLoading}
                            >
                                Submit
                            </Button>
                        </Stack>
                        {authenticationError &&
                            <ProblemAlert problem={authenticationError} />}
                    </FormControl>
                </form>
            </ResponsiveModal>
        </>
    )
}
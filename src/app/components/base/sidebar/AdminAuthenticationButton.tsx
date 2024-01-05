'use client'

import { mutateAdminInfo } from "@/app/hooks/useAdminInfo";
import { InstanceApi } from "@/app/lib/api/InstanceApi";
import { Problem } from "@/app/lib/dto/Problem";
import { AdminAuthRequest } from "@/app/lib/dto/admin/auth/AdminAuthRequest";
import { AdminPanelSettings } from "@mui/icons-material";
import { Button, FormControl, FormLabel, IconButton, Input, Link, Stack, Typography } from "@mui/joy";
import { ChangeEvent, useState } from "react";
import { ProblemAlert } from "../../alert/ProblemAlert";
import { ResponsiveModal } from "../../modal/ResponsiveModal";
import { extractErrorMessage } from "@/app/lib/api/utils";
import { InfoAlert } from "../../alert/InfoAlert";

interface AdminAuthenticationButtonProps {
    isAuthenticated: boolean,
    onLogoutSucceed: () => void
}

export const AdminAuthenticationButton = ({ isAuthenticated, onLogoutSucceed: onLogoutSucceeded }: AdminAuthenticationButtonProps) => {
    const [adminPassword, setAdminPassword] = useState<string>('');
    const [isAuthenticationLoading, setIsAuthenticationLoading] = useState<boolean>(false);
    const [showAdminAuthentication, setShowAdminAuthentication] = useState<boolean>(false);
    const [authenticationError, setAuthenticationError] = useState<Problem | undefined>();
    const [isLogoutLoading, setIsLogoutLoading] = useState<boolean>(false);

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

    const logout = () => {
        setIsLogoutLoading(true);
        InstanceApi.logoutAdmin()
            .then((res) => {
                if (res.ok) {
                    onLogoutSucceeded();
                    setShowAdminAuthentication(false);
                }
            })
            .finally(() => {
                setIsLogoutLoading(false);
                setAdminPassword('');
            })
    }

    const modalBody = () => {
        if (!isAuthenticated) {
            return (<form
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
                    <InfoAlert sx={{ mt: 1 }}>
                        <Typography>
                            If you have lost your password you can follow this steps from our <Link component='a' referrerPolicy='no-referrer' target='_blank' href="https://github.com/hopfront/hopfront/wiki/Instance-configuration#admin-role" underline='always'>
                                Wiki</Link>.
                        </Typography>
                    </InfoAlert>
                    {authenticationError &&
                        <ProblemAlert problem={authenticationError} />}
                </FormControl>
            </form>)
        } else {
            return <>
                <InfoAlert sx={{ mt: 1 }}>You are currently logged in as an administrator</InfoAlert>
                <Button
                    onClick={logout}
                    loading={isLogoutLoading}
                    color="danger"
                    sx={{ mt: 1 }}>
                    Log out
                </Button>
            </>
        }
    }

    return (
        <>
            <IconButton
                title="Admin role"
                variant="outlined"
                sx={{borderWidth: "2px"}}
                color={isAuthenticated ? 'success' : 'neutral'}
                onClick={() => setShowAdminAuthentication(true)}>
                <AdminPanelSettings />
            </IconButton>
            <ResponsiveModal onClose={() => setShowAdminAuthentication(false)} open={showAdminAuthentication}>
                <Typography level="title-lg">Admin authentication</Typography>
                {modalBody()}
            </ResponsiveModal>
        </>
    )
}
'use client'

import { AdminPanelSettings } from "@mui/icons-material"
import { Button, FormControl, FormLabel, IconButton, Input, Stack, Typography } from "@mui/joy"
import { ChangeEvent, useState } from "react";
import { ResponsiveModal } from "../../modal/ResponsiveModal";

interface AdminAuthenticationButtonProps {
    isAuthenticated: boolean,
    onAuthenticationSubmit: (password: string) => void
}

export const AdminAuthenticationButton = ({ isAuthenticated, onAuthenticationSubmit }: AdminAuthenticationButtonProps) => {
    const [adminPassword, setAdminPassword] = useState<string>('');
    const [isAuthenticationLoading, setIsAuthenticationLoading] = useState<boolean>(false);
    const [showAdminAuthentication, setShowAdminAuthentication] = useState<boolean>(false);

    const onSubmitAdminAuthentication = (event: ChangeEvent<HTMLFormElement>) => {
        event.preventDefault();

        setIsAuthenticationLoading(true);
        setTimeout(() => {
            setIsAuthenticationLoading(false);
            setShowAdminAuthentication(false);
        }, 1000);

        onAuthenticationSubmit(adminPassword);
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

                    </FormControl>
                </form>
            </ResponsiveModal>
        </>
    )
}
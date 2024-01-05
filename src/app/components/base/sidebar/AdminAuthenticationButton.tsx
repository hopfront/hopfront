'use client'

import { AdminPanelSettings } from "@mui/icons-material";
import { IconButton } from "@mui/joy";
import { useState } from "react";
import { AdminAuthentication } from "./AdminAuthentication";

interface AdminAuthenticationButtonProps {
    isAuthenticated: boolean,
    onLogoutSucceed: () => void
}

export const AdminAuthenticationButton = ({ isAuthenticated, onLogoutSucceed: onLogoutSucceeded }: AdminAuthenticationButtonProps) => {
    const [showAdminAuthentication, setShowAdminAuthentication] = useState<boolean>(false);

    return (
        <>
            <IconButton
                title="Admin role"
                variant="outlined"
                sx={{ borderWidth: "2px" }}
                color={isAuthenticated ? 'success' : 'neutral'}
                onClick={() => setShowAdminAuthentication(true)}>
                <AdminPanelSettings />
            </IconButton>
            <AdminAuthentication
                open={showAdminAuthentication}
                onClose={() => setShowAdminAuthentication(false)}
                onLogoutSucceeded={onLogoutSucceeded} />
        </>
    )
}
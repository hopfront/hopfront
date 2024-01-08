'use client'

import { AdminPanelSettings } from "@mui/icons-material";
import { IconButton } from "@mui/joy";
import { useState } from "react";
import { AdminAuthenticationModal } from "./AdminAuthenticationModal";

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
            <AdminAuthenticationModal
                open={showAdminAuthentication}
                onClose={() => setShowAdminAuthentication(false)}
                onLoginSucceeded={() => setShowAdminAuthentication(false)}
                onLogoutSucceeded={() => { setShowAdminAuthentication(false); onLogoutSucceeded() }} />
        </>
    )
}
'use client';

import { WarningAlert } from "@/app/components/alert/WarningAlert";
import { AdminContext } from "@/app/context/AdminContext";
import { LinearProgress, Typography } from "@mui/joy";
import Box from "@mui/joy/Box";
import { useContext } from "react";
import { AdminRoleDisabledState } from "./AdminRoleDisabledState";
import { AdminRoleEnabledState } from "./AdminRoleEnabledState";

export default function AdminStatusSettings() {
    const adminContext = useContext(AdminContext);

    if (adminContext.adminStatus === undefined) {
        return <LinearProgress />
    }

    const isAdminRoleEnabled = adminContext?.adminStatus?.isEnabled === true;
    const isAdminStatusEditable = adminContext?.adminStatus?.isEditable === true;

    if (isAdminStatusEditable === false) {
        return <Box>
            <WarningAlert title='Admin role is not editable'>
                <Typography>
                    The admin password is set through the HOPFRONT_ADMIN_PASSWORD environment variable, which takes precedence over HopFront settings.<br />
                    To add or modify the admin password directly in HopFront, you must first remove the HOPFRONT_ADMIN_PASSWORD environment variable.
                </Typography>
            </WarningAlert>
        </Box>
    }

    return (
        <Box>
            {!isAdminRoleEnabled && isAdminStatusEditable &&
                <AdminRoleDisabledState />}
            {isAdminRoleEnabled && isAdminStatusEditable &&
                <AdminRoleEnabledState />
            }
        </Box>
    );
}
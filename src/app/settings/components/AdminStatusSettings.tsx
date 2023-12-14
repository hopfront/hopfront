'use client';

import { WarningAlert } from "@/app/components/alert/WarningAlert";
import { ErrorAlert } from "@/app/components/operation/response/ErrorAlert";
import useAdminStatus from "@/app/hooks/useAdminStatus";
import { LinearProgress, Typography } from "@mui/joy";
import Box from "@mui/joy/Box";
import { DisableAdminRole } from "./DisableAdminRole";
import { EnableAdminRole } from "./EnableAdminRole";

export default function AdminStatusSettings() {
    const { data: adminStatus, isLoading: isAdminStatusLoading, error: adminStatusError } = useAdminStatus();

    const isAdminRoleEnabled = !!adminStatus?.password && adminStatus.password.length > 0;
    const isAdminStatusEditable = adminStatus?.isEditable === true;

    if (isAdminStatusLoading) {
        return <LinearProgress sx={{ mt: 2 }} />;
    }

    if (adminStatusError) {
        return <ErrorAlert error={adminStatusError} />
    }

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
            {!isAdminRoleEnabled && adminStatus && isAdminStatusEditable &&
                <EnableAdminRole
                    adminStatus={adminStatus} />}
            {isAdminRoleEnabled && adminStatus && isAdminStatusEditable &&
                <DisableAdminRole
                    adminStatus={adminStatus} />
            }
        </Box>
    );
}
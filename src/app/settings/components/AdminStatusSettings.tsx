'use client';

import { ErrorAlert } from "@/app/components/operation/response/ErrorAlert";
import useAdminStatus from "@/app/hooks/useAdminStatus";
import { LinearProgress, Typography } from "@mui/joy";
import Box from "@mui/joy/Box";
import { useEffect, useState } from "react";
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
        return <Typography>Not editable</Typography>
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
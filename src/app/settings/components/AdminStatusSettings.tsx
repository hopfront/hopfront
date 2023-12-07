'use client';

import { ErrorAlert } from "@/app/components/operation/response/ErrorAlert";
import useAdminStatus from "@/app/hooks/useAdminStatus";
import { LinearProgress } from "@mui/joy";
import Box from "@mui/joy/Box";
import { useEffect, useState } from "react";
import { DisableAdminRole } from "./DisableAdminRole";
import { EnableAdminRole } from "./EnableAdminRole";

export default function AdminStatusSettings() {
    const { data: adminStatus, isLoading: isAdminStatusLoading, error: adminStatusError } = useAdminStatus();
    const [isAdminRoleEnabled, setIsAdminRoleEnabled] = useState<boolean | undefined>();
    const [isAdminStatusEditable, setIsAdminStatusEditable] = useState<boolean>(adminStatus?.isEditable ?? true)

    useEffect(() => {
        if (adminStatus) {
            setIsAdminRoleEnabled(!!adminStatus.password && adminStatus.password.length > 0);
        }
    }, [adminStatus]);

    if (isAdminStatusLoading) {
        return <LinearProgress sx={{ mt: 2 }} />;
    }

    if (adminStatusError) {
        return <ErrorAlert error={adminStatusError} />
    }

    return (
        <Box>
            {!isAdminRoleEnabled && adminStatus &&
                <EnableAdminRole
                    adminStatus={adminStatus} />}
            {isAdminRoleEnabled && adminStatus &&
                <DisableAdminRole
                    adminStatus={adminStatus} />
            }
        </Box>
    );
}
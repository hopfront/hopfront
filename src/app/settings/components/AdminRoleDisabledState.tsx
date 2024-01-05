'use client';

import { InfoAlert } from "@/app/components/alert/InfoAlert";
import Box from "@mui/joy/Box";
import Button from "@mui/joy/Button";
import Typography from "@mui/joy/Typography";
import { useState } from "react";
import { EnableAdminRoleModal } from "./EnableAdminRoleModal";

export const AdminRoleDisabledState = () => {
    const [enableAdminRoleModalOpen, setEnableAdminRoleModalOpen] = useState(false);

    return (
        <Box sx={{ mt: 1 }}>
            <InfoAlert>
                <Typography>
                    When enabled the admin role solely permits the administrator to add or modify API specifications, dashboards and operations. <br />
                    Every other users will only have read access and use predefined operations.
                </Typography>
            </InfoAlert>
            <Button
                sx={{ mt: 1 }}
                onClick={() => setEnableAdminRoleModalOpen(true)}>
                Activate administrator role
            </Button>

            <EnableAdminRoleModal
                open={enableAdminRoleModalOpen}
                onClose={() => setEnableAdminRoleModalOpen(false)} />
        </Box>
    )
}
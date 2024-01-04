'use client';

import { InfoAlert } from "@/app/components/alert/InfoAlert";
import { mutateAdminInfo } from "@/app/hooks/useAdminInfo";
import { InstanceApi } from "@/app/lib/api/InstanceApi";
import { Problem } from "@/app/lib/dto/Problem";
import { Stack } from "@mui/joy";
import Box from "@mui/joy/Box";
import Button from "@mui/joy/Button";
import Typography from "@mui/joy/Typography";
import { useState } from "react";
import { DisableAdminRoleModal } from "./DisableAdminRoleModal";
import { UpdateAdminPasswordModal } from "./UpdateAdminPasswordModal";
import { extractErrorMessage } from "@/app/lib/api/utils";

export const AdminRoleEnabledState = () => {
    const [disableAdminRoleModalOpen, setDisableAdminRoleModalOpen] = useState(false);
    const [updatePasswordModalOpen, setUpdatePasswordModalOpen] = useState(false);

    return (
        <Box sx={{ mt: 1 }}>
            <Box>
                <InfoAlert title={''}>
                    <Typography>
                        You are currently logged in as an administrator. <br />
                        You have the ability to add or modify API specifications, dashboards, and operations.
                    </Typography>
                </InfoAlert>
                <Stack direction={'row'} gap={1}>
                    <Button
                        color='danger'
                        sx={{ mt: 1 }}
                        onClick={() => {
                            setDisableAdminRoleModalOpen(true);
                        }}>
                        Disable administrator role
                    </Button>
                    <Button
                        onClick={() => { setUpdatePasswordModalOpen(true) }}
                        variant="outlined"
                        sx={{ mt: 1 }}>
                        Update password
                    </Button>
                </Stack>
            </Box>
            <DisableAdminRoleModal
                open={disableAdminRoleModalOpen}
                onClose={() => { setDisableAdminRoleModalOpen(false); }} />
            <UpdateAdminPasswordModal
                open={updatePasswordModalOpen}
                onClose={() => { setUpdatePasswordModalOpen(false) }} />
        </Box >);
}

import { ProblemAlert } from "@/app/components/alert/ProblemAlert";
import { WarningAlert } from "@/app/components/alert/WarningAlert";
import { ResponsiveModal } from "@/app/components/modal/ResponsiveModal";
import { mutateAdminInfo } from "@/app/hooks/useAdminInfo";
import { InstanceApi } from "@/app/lib/api/InstanceApi";
import { extractErrorMessage } from "@/app/lib/api/utils";
import { Problem } from "@/app/lib/dto/Problem";
import { FormControl, FormLabel, Input, Stack } from "@mui/joy";
import Box from "@mui/joy/Box";
import Button from "@mui/joy/Button";
import Typography from "@mui/joy/Typography";
import { useState } from "react";

interface DisableAdminRoleModalProps {
    open: boolean
    onClose: () => void
}

export const DisableAdminRoleModal = ({ open, onClose }: DisableAdminRoleModalProps) => {
    const [isDisableButtonEnabled, setIsDisableButtonEnabled] = useState<boolean>(false);
    const [isDisableAdminRoleLoading, setIsDisableAdminRoleLoading] = useState(false);
    const [submitAdminStatusError, setSubmitAdminStatusError] = useState<Problem | undefined>();
    const [password, setPassword] = useState<string>('');

    const onDisableAdminRole = () => {
        setIsDisableAdminRoleLoading(true);
        InstanceApi.disableAdminRole(password)
            .then(async (response) => {
                if (response.ok) {
                    mutateAdminInfo();
                    onClose();
                    return;
                }

                setSubmitAdminStatusError({
                    title: 'We failed to disable your admin role',
                    status: response.status,
                    detail: await extractErrorMessage(response)
                })
            }).finally(() => {
                setIsDisableAdminRoleLoading(false);
            })
    }

    return (
        <>
            <ResponsiveModal open={open} onClose={onClose}>
                <Box>
                    <Typography level='h3'>Disable administrator role</Typography>
                    <WarningAlert title={''}>
                        <Typography level='body-sm' sx={{ mt: 1 }}>
                            As soon as you disable the administrator role, every user will be able to add, modify or delete API specifications, dashboards and operations.
                        </Typography>
                    </WarningAlert>
                    <FormControl sx={{ mt: 2 }}>
                        <FormLabel>
                            Confirm your password
                        </FormLabel>
                        <Input
                            type="password"
                            value={password}
                            placeholder="password"
                            onChange={(event) => { setIsDisableButtonEnabled(event.target.value.length > 0); setPassword(event.target.value); }}
                        />
                    </FormControl>
                    <Stack direction='row' gap={1} sx={{ mt: 3 }}>
                        <Button
                            color='danger'
                            onClick={onDisableAdminRole}
                            disabled={!isDisableButtonEnabled}
                            loading={isDisableAdminRoleLoading}>
                            Disable administrator role
                        </Button>
                        <Button
                            variant='outlined'
                            onClick={onClose}>
                            Cancel
                        </Button>
                    </Stack>
                    {submitAdminStatusError &&
                        <ProblemAlert
                            problem={submitAdminStatusError}
                            onClose={() => { setSubmitAdminStatusError(undefined) }}
                        />
                    }
                </Box>
            </ResponsiveModal>
        </>
    )
}
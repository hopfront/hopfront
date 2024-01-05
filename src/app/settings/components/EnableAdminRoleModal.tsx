import { InfoAlert } from "@/app/components/alert/InfoAlert";
import { ProblemAlert } from "@/app/components/alert/ProblemAlert";
import { WarningAlert } from "@/app/components/alert/WarningAlert";
import { ResponsiveModal } from "@/app/components/modal/ResponsiveModal";
import { InstanceApi } from "@/app/lib/api/InstanceApi";
import { extractErrorMessage } from "@/app/lib/api/utils";
import { Problem } from "@/app/lib/dto/Problem";
import { AdminPanelSettings, East } from "@mui/icons-material";
import { FormControl, FormLabel, Input, Stack } from "@mui/joy";
import Box from "@mui/joy/Box";
import Button from "@mui/joy/Button";
import Typography from "@mui/joy/Typography";
import { useState } from "react";

interface EnableAdminRoleModalProps {
    open: boolean
    onClose: () => void
}

export const EnableAdminRoleModal = ({ open, onClose }: EnableAdminRoleModalProps) => {
    const [adminPassword, setAdminPassword] = useState<string>('');
    const [confirmedAdminPassword, setConfirmedAdminPassword] = useState<string>('');
    const [isSubmitAdminStatusLoading, setIsSubmitAdminStatusLoading] = useState(false);
    const [submitAdminStatusError, setSubmitAdminStatusError] = useState<Problem | undefined>();

    const onSubmitAdminRoleEnabled = (e: React.MouseEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitAdminStatusLoading(true);

        const password = adminPassword.trim();
        const confirmedPassword = confirmedAdminPassword.trim();

        if (password === '' || confirmedPassword === '') {
            setIsSubmitAdminStatusLoading(false);
            setSubmitAdminStatusError({
                title: 'Your password should not be empty (or composed only of spaces)',
                status: -1
            })
            return;
        }

        if (password != confirmedPassword) {
            setIsSubmitAdminStatusLoading(false);
            setSubmitAdminStatusError({
                title: 'Your passwords are not identical',
                status: -1
            })
            return;
        }

        InstanceApi.enableAdminRole({ password: adminPassword })
            .then(async (response) => {
                if (response.ok) {
                    onClose();
                    return;
                }

                setSubmitAdminStatusError({
                    title: 'We failed to activate admin role',
                    status: response.status,
                    detail: await extractErrorMessage(response)
                })
            }).finally(() => {
                setIsSubmitAdminStatusLoading(false);
            })

    }

    return (
        <ResponsiveModal open={open} onClose={onClose}>
            <Box>
                <Typography level='h3'>Enable HopFront admin mode</Typography>
                <form
                    onSubmit={onSubmitAdminRoleEnabled}
                    style={{ marginTop: '18px' }}>
                    <FormControl>
                        <FormLabel>
                            Password<Typography level="body-xs" color="danger">*</Typography>
                        </FormLabel>
                        <Input
                            value={adminPassword}
                            onChange={(e) => setAdminPassword(e.target.value)}
                            type="password"
                            required
                            placeholder="Password"
                        />
                    </FormControl>
                    <FormControl sx={{ mt: 1 }}>
                        <FormLabel>
                            Confirm password<Typography level="body-xs" color="danger">*</Typography>
                        </FormLabel>
                        <Input
                            value={confirmedAdminPassword}
                            onChange={(e) => setConfirmedAdminPassword(e.target.value)}
                            type="password"
                            required
                            placeholder="Confirm password"
                        />
                    </FormControl>
                    <WarningAlert title={''}>
                        <Typography>
                            Keep your password safe as you will not be able to reset it later.
                        </Typography>
                    </WarningAlert>


                    <Box
                        display={'flex'}
                        sx={{
                            justifyContent: 'center',
                            p: 1,
                            mt: 3,
                            borderRadius: '8px',
                            borderStyle: 'solid',
                            borderWidth: '1px',
                            borderColor: 'var(--joy-palette-primary-500)'
                        }}>
                        <Box sx={{ width: '50%' }}>
                            <Stack direction={'row'} justifyContent={'space-around'}>
                                <Stack>
                                    <AdminPanelSettings sx={{ alignSelf: 'center' }} />
                                    <Typography level="body-sm">User</Typography>
                                </Stack>
                                <East sx={{ alignSelf: 'center' }} />
                                <Stack>
                                    <AdminPanelSettings color="success" sx={{ alignSelf: 'center' }} />
                                    <Typography level="body-sm" color="success">Administrator</Typography>
                                </Stack>
                            </Stack>
                        </Box>
                    </Box>
                    <Typography level="title-sm" fontWeight={'400'} sx={{ mt: 1, textAlign: 'center' }}>
                        Keep track of your administrator status from HopFront side bar.
                    </Typography>

                    <Stack direction='row' gap={1} sx={{ mt: 3 }}>
                        <Button type='submit' loading={isSubmitAdminStatusLoading} disabled={isSubmitAdminStatusLoading}>
                            Enable admin mode
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
                            onClose={() => setSubmitAdminStatusError(undefined)}
                        />
                    }
                </form>
            </Box>
        </ResponsiveModal>
    );
}
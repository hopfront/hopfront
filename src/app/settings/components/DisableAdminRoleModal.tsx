
import { ProblemAlert } from "@/app/components/alert/ProblemAlert";
import { WarningAlert } from "@/app/components/alert/WarningAlert";
import { ResponsiveModal } from "@/app/components/modal/ResponsiveModal";
import { Stack } from "@mui/joy";
import Box from "@mui/joy/Box";
import Button from "@mui/joy/Button";
import Typography from "@mui/joy/Typography";

interface DisableAdminRoleModalProps {
    open: boolean
    loading: boolean
    error: any
    onClose: () => void
    onDisableClicked: () => void
    onDismissError: () => void
}

export const DisableAdminRoleModal = ({ open, loading, error, onClose, onDisableClicked, onDismissError }: DisableAdminRoleModalProps) => {
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
                    <Stack direction='row' gap={1} sx={{ mt: 3 }}>
                        <Button
                            color='danger'
                            onClick={onDisableClicked}
                            loading={loading}>
                            Disable administrator role
                        </Button>
                        <Button
                            variant='outlined'
                            onClick={onClose}>
                            Cancel
                        </Button>
                    </Stack>
                    {error &&
                        <ProblemAlert
                            problem={error}
                            onClose={onDismissError}
                        />
                    }
                </Box>
            </ResponsiveModal>
        </>
    )
}
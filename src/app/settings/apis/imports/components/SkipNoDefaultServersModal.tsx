import { WarningAlert } from "@/app/components/alert/WarningAlert";
import { ResponsiveModal } from "@/app/components/modal/ResponsiveModal";
import { Box, Button, Stack, Typography } from "@mui/joy";

interface SkipNoDefaultServersModalProps {
    showModal: boolean
    onCancel: () => void
    onContinue: () => void
}

export default function skipNoDefaultServersModal({ showModal, onCancel, onContinue }: SkipNoDefaultServersModalProps) {
    return (
        <ResponsiveModal open={showModal} onClose={() => onCancel()}>
            <WarningAlert title="No default servers found">
                <Typography>
                    You are attempting to import an OpenAPI specification that lacks default servers configured. <br />
                    We recommend updating your API specification to include default servers before importing. However, if you choose not to, you can still proceed and later configure custom servers in the API settings.
                </Typography>
            </WarningAlert>

            <Stack direction='row' sx={{ mt: 2 }} gap={1}>
                <Button onClick={() => onCancel()}>
                    Cancel
                </Button>
                <Button color='warning' onClick={() => onContinue()}>
                    Continue without configured servers
                </Button>
            </Stack>
        </ResponsiveModal>
    )
}
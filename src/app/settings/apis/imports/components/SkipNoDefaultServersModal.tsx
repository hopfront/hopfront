import { WarningAlert } from "@/app/components/alert/WarningAlert";
import { ResponsiveModal } from "@/app/components/modal/ResponsiveModal";
import { Box, Button, Stack, Typography } from "@mui/joy";
import {ButtonRow} from "@/app/components/button/ButtonRow";
import {Warning} from "@mui/icons-material";

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

            <ButtonRow sx={{mt: 2}} align="right">
                <Button variant="outlined" onClick={() => onCancel()}>
                    Cancel
                </Button>
                <Button startDecorator={<Warning/>} color='warning' onClick={() => onContinue()}>
                    Continue without configured servers
                </Button>
            </ButtonRow>
        </ResponsiveModal>
    )
}
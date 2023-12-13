import { WarningAlert } from "@/app/components/alert/WarningAlert";
import { ResponsiveModal } from "@/app/components/modal/ResponsiveModal";
import { Box, Button, Link, Stack, Typography } from "@mui/joy";
import { ButtonRow } from "@/app/components/button/ButtonRow";
import { Warning } from "@mui/icons-material";
import { Problem } from "@/app/lib/dto/Problem";
import { ApiErrorCode } from "@/app/common/ApiErrorCode";

interface SkipSpecImportWarningsModalProps {
    showModal: boolean
    onCancel: () => void
    onContinue: () => void
    problem?: Problem
}

export default function SkipSpecImportWarningsModal({ showModal, onCancel, onContinue, problem }: SkipSpecImportWarningsModalProps) {
    return (
        <ResponsiveModal open={showModal} onClose={() => onCancel()}>
            <WarningAlert title="We find some errors in your Open API specification" />

            {problem?.codes?.includes(ApiErrorCode.NoDefaultServersError) &&
                <Box sx={{mt: 2}}>
                    <Typography level="title-md">
                        No default servers configured:
                    </Typography>
                    <Typography>
                        You are attempting to import an OpenAPI specification that lacks a valid default server (e.g., &quot;https://mybaseurl.com&quot;).<br />
                        We recommend updating your API specification to include default servers before importing. However, if you choose not to, you can still proceed and later configure custom servers in the API settings.
                    </Typography>
                </Box>}

            {problem?.codes?.includes(ApiErrorCode.SpecValidationError) &&
                <Box sx={{mt: 2}}>
                    <Typography level="title-md">Your specification includes some formatting errors:</Typography>
                    <Typography>To get details about the errors present in your file, submit it to the official Open API specification parser at <Link>https://apitools.dev/swagger-parser/online/</Link></Typography>
                </Box>}

            <ButtonRow sx={{ mt: 2 }} align="right">
                <Button variant="outlined" onClick={() => onCancel()}>
                    Cancel
                </Button>
                <Button startDecorator={<Warning />} color='warning' onClick={() => onContinue()}>
                    Ignore warnings and import anyway
                </Button>
            </ButtonRow>
        </ResponsiveModal>
    )
}
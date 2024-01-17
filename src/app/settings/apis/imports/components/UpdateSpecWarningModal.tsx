import { WarningAlert } from "@/app/components/alert/WarningAlert";
import { ResponsiveModal } from "@/app/components/modal/ResponsiveModal";
import { Stack, Typography } from "@mui/joy";
import Button from "@mui/joy/Button";

interface OnUpdateWarningModalProps {
    open: boolean
    onProceed: () => void
    onClose: () => void
}
export const UpdateSpecWarningModal = ({ open, onProceed, onClose }: OnUpdateWarningModalProps) => {
    return (
        <ResponsiveModal
            open={open}
            onClose={onClose}>
            <Stack direction={'column'} gap={1}>
                <WarningAlert title='Be aware that updating your specification can break existing configurations:'>
                    <ul>
                        <li>If you&apos;ve changed an endpoint and its id;</li>
                        <li>If you&apos;ve changed parameter or property names.</li>
                    </ul>
                </WarningAlert>
                <Stack direction={'row'} gap={1} sx={{mt: 1}}>
                    <Button color="warning" onClick={onProceed}>Update specification</Button>
                    <Button variant='outlined' onClick={onClose}>Cancel</Button>
                </Stack>
            </Stack>
        </ResponsiveModal>
    )
}
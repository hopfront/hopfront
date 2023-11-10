import Typography from "@mui/joy/Typography";
import {Button} from "@mui/joy";
import {ResponsiveModal} from "@/app/components/modal/ResponsiveModal";
import {ButtonRow} from "@/app/components/button/ButtonRow";

export interface ConfirmModalProps {
    title?: string
    onConfirm?: () => void
    onCancel?: () => void
}

export const ConfirmModal = ({title, onConfirm, onCancel}: ConfirmModalProps) => {
    return (
        <ResponsiveModal open={!!title && !!onConfirm && !!onCancel} onClose={() => onCancel && onCancel()}>
            <Typography level="title-md">{title}</Typography>
            <ButtonRow align="right" sx={{mt: 2}}>
                <Button
                    variant="solid"
                    onClick={onConfirm}>OK</Button>
                <Button
                    variant="outlined"
                    onClick={onCancel}>Cancel</Button>
            </ButtonRow>
        </ResponsiveModal>
    );
}
import { Box, ModalClose, Sheet } from "@mui/joy";
import Modal from "@mui/joy/Modal";
import ModalOverflow from "@mui/joy/ModalOverflow";
import React from "react";

interface ResponsiveModalProps {
    open: boolean,
    onClose: (_event: React.MouseEvent<HTMLButtonElement>, reason: string) => void,
    children: React.ReactNode,
    hasCloseButton?: boolean,
    sx?: {}
}

export const ResponsiveModal = ({ open, onClose, children, hasCloseButton = true, sx }: ResponsiveModalProps) => {
    return (
        <Modal
            aria-labelledby="close-modal-title"
            open={open}
            disableRestoreFocus
            onClose={(_event: React.MouseEvent<HTMLButtonElement>, reason: string) => {
                onClose(_event, reason);
            }}
            sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
            }}
        >
            <ModalOverflow sx={{
                width: {
                    sx: '100%',
                    md: 'auto'
                },
                position: 'relative',
                minWidth: '50%',
                maxWidth: {
                    sx: '100%',
                    md: '70%'
                },
                mt: 2
            }}>
                <Sheet
                    variant="outlined"
                    sx={{
                        borderRadius: 'md',
                        p: 3,
                        ...sx
                    }}
                >
                    {hasCloseButton ?
                        <>
                            <ModalClose variant="outlined" />
                            <Box sx={{ mt: 3, pb: 1 }}>
                                {children}
                            </Box>
                        </> :
                        <>{children}</>
                    }
                </Sheet>
            </ModalOverflow>
        </Modal>
    )
}
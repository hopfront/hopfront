import { CloseRounded, Info } from "@mui/icons-material";
import Typography from "@mui/joy/Typography";
import { Alert, Box, IconButton } from "@mui/joy";
import React, {ReactNode, useState} from "react";

export interface InfoAlertProps {
    title?: ReactNode
    children?: React.ReactNode;
    onClose?: () => void,
    sx?: {}
}

export const InfoAlert = ({ title, children, onClose, sx }: InfoAlertProps) => {
    const [showCancel, setShowCancel] = useState(false);


    return (
        <Alert
            onMouseOver={() => { setShowCancel(true) }}
            onMouseLeave={() => { setShowCancel(false) }}
            variant="soft"
            color="primary"
            startDecorator={<Info />}
            endDecorator={
                <>{showCancel && onClose &&
                    <IconButton variant="plain" size="sm" color="neutral" onClick={onClose}>
                        <CloseRounded />
                    </IconButton>
                }
                </>
            }
            sx={{
                ...sx,
                alignItems: 'flex-start'
            }}>
            <Box>
                {title &&
                    <Typography level='title-sm'>{title}</Typography>}
                <Typography level="body-sm" color="primary">
                    {children}
                </Typography>
            </Box>
        </Alert>
    );
}
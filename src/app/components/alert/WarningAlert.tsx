import {Warning} from "@mui/icons-material";
import Typography from "@mui/joy/Typography";
import {Alert} from "@mui/joy";
import React, {ReactNode} from "react";

export interface WarningAlertProps {
    title: ReactNode
    children?: React.ReactNode;
}

export const WarningAlert = ({title, children}: WarningAlertProps) => {
    return (
        <Alert
            sx={{
                mt: 1,
                alignItems: 'flex-start'
            }}
            startDecorator={<Warning />}
            variant="soft"
            color="warning">
            <div>
                <div>{title}</div>
                <Typography level="body-sm" color="warning">
                    {children}
                </Typography>
            </div>
        </Alert>
    );
}
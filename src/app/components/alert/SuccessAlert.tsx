import { Check } from "@mui/icons-material";
import { Alert } from "@mui/joy";
import Typography from "@mui/joy/Typography";
import React from "react";

export interface SuccessAlertProps {
    title: string
    children?: React.ReactNode;
}

export const SuccessAlert = ({ title, children }: SuccessAlertProps) => {
    return (
        <Alert
            sx={{
                mt: 1,
                alignItems: 'flex-start'
            }}
            startDecorator={<Check />}
            variant="soft"
            color="success">
            <div>
                <div>{title}</div>
                <Typography level="body-sm" color="warning">
                    {children}
                </Typography>
            </div>
        </Alert>
    );
}
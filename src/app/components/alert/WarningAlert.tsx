import { Warning } from "@mui/icons-material";
import Typography from "@mui/joy/Typography";
import { Alert, Box, Stack } from "@mui/joy";
import React, { ReactNode } from "react";

export interface WarningAlertProps {
    title: ReactNode
    headerActionButton?: ReactNode,
    children?: React.ReactNode;
}

export const WarningAlert = ({ title, headerActionButton, children }: WarningAlertProps) => {
    return (
        <Alert
            sx={{
                mt: 1,
                alignItems: 'flex-start'
            }}
            startDecorator={<Warning />}
            variant="soft"
            color="warning">
            <Box>
                <Stack direction={'row'} justifyContent={'space-between'}>
                    {title}
                    {headerActionButton}
                </Stack>
                <Typography level="body-sm" color="warning">
                    {children}
                </Typography>
            </Box>
        </Alert>
    );
}
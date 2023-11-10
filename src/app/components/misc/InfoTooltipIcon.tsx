import Box from "@mui/joy/Box";
import { InfoOutlined } from "@mui/icons-material";
import { Tooltip } from "@mui/joy";
import React from "react";

export interface InfoTooltipIconProps {
    children?: React.ReactNode
}

export const InfoTooltipIcon = ({ children }: InfoTooltipIconProps) => {
    return (
        <Tooltip
            placement="bottom-start"
            variant='outlined'
            title={
                <Box sx={{ maxWidth: 720 }}>
                    {children}
                </Box>
            }>
            <InfoOutlined />
        </Tooltip>
    );
}
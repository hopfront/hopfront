import {Stack, Typography} from "@mui/joy";
import {ReactNode} from "react";

export interface PageHeaderProps {
    icon?: ReactNode
    text: string
}

export const PageHeader = ({icon, text}: PageHeaderProps) => {
    return (
        <Typography level="h1">
            <Stack direction="row">
                {icon && <Stack justifyContent="center" sx={{mr: 1}} fontSize={20}>
                    {icon}
                </Stack>}
                <Typography>
                    {text}
                </Typography>
            </Stack>
        </Typography>
    );
}
import {Stack} from "@mui/joy";
import {ReactNode} from "react";
import {SxProps} from "@mui/joy/styles/types";

export type ButtonRowAlign = "left" | "right"

export interface ButtonRowProps {
    align?: ButtonRowAlign
    children: ReactNode;
    sx?: SxProps
}

export const ButtonRow = ({align = "left", children, sx}: ButtonRowProps) => {
    return (
        <Stack
            direction="row"
            spacing={1}
            justifyContent={align === 'right' ? 'end' : 'start'} sx={{...sx}}>
            {children}
        </Stack>
    );
}
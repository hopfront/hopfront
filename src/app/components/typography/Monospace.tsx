import React from "react";
import Typography from "@mui/joy/Typography";
import {OverridableStringUnion} from "@mui/types";
import {TypographySystem, VariantProp} from "@mui/joy/styles/types";
import {TypographyPropsVariantOverrides} from "@mui/joy/Typography/TypographyProps";

export interface MonospaceProps {
    children?: React.ReactNode
    level?: keyof TypographySystem | 'inherit';
    variant?: OverridableStringUnion<VariantProp, TypographyPropsVariantOverrides>;
}

export const Monospace = ({children, level, variant}: MonospaceProps) => {
    return (
        <Typography level={level} fontFamily="monospace" variant={variant}>{children}</Typography>
    );
}
import * as React from 'react';
import AspectRatio, { AspectRatioProps } from '@mui/joy/AspectRatio';
import {LogoDev} from "@mui/icons-material";

export default function HopFrontLogo({ sx, ...props }: AspectRatioProps) {
    return (
        <AspectRatio
            ratio="1"
            variant="plain"
            {...props}
            sx={[
                {
                    width: 36,
                    borderRadius: 'sm',
                },
                ...(Array.isArray(sx) ? sx : [sx]),
            ]}
        >
            <div>
                <LogoDev/>
            </div>
        </AspectRatio>
    );
}

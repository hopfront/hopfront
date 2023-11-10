'use client';

import { Box } from "@mui/joy";

export interface MainFrameProps {
    children: React.ReactNode
}

export default function MainFrame({ children }: MainFrameProps) {
    return <Box sx={(theme) => ({
        '--main-paddingTop': {
            xs: `calc(${theme.spacing(2)} + var(--Header-height, 0px))`,
            md: '32px',
        },
        px: {
            xs: 1,
            md: 2,
            lg: 3
        },
        pb: {
            xs: 1,
            md: 2,
            lg: 3
        },
        pt: 'var(--main-paddingTop)'
    })}>
        {children}
    </Box>;
}
'use client'

import { Box } from "@mui/joy";

export interface LayoutProps {
    children: React.ReactNode
}

export default function Layout({ children }: LayoutProps) {
    return <Box sx={(theme) => ({
        height: '100%',
        '--main-paddingTop': {
            xs: `calc(${theme.spacing(2)} + var(--Header-height))`,
            md: 0
        }
    })}>
        {children}
    </Box>
}
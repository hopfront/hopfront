import CssBaseline from '@mui/joy/CssBaseline';
import GlobalStyles from '@mui/joy/GlobalStyles';
import {CssVarsProvider, extendTheme} from '@mui/joy/styles';
import * as React from 'react';

const theme = extendTheme({
    colorSchemes: {
        dark: {
            palette: {
                background: {
                    body: '#161b22',
                    surface: '#0d1117',
                }
            }
        },
    },
});

export interface ThemeProviderProps {
    children: React.ReactNode
}

export default function ThemeProvider({ children }: ThemeProviderProps) {
    return (
        <CssVarsProvider disableTransitionOnChange theme={theme}>
            <GlobalStyles
                styles={{
                    '[data-feather], .feather': {
                        color: 'var(--Icon-color)',
                        margin: 'var(--Icon-margin)',
                        fontSize: 'var(--Icon-fontSize, 20px)',
                        width: '1em',
                        height: '1em',
                    },
                }}
            />
            <CssBaseline />
            {children}
        </CssVarsProvider>

    );
}

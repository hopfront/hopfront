'use client';

import ThemeProvider from "@/app/components/base/CssProvider";
import Navigation from "@/app/components/base/Navigation";
import { ErrorBoundaryFallback } from "@/app/components/misc/ErrorBoundaryFallback";
import React from "react";
import { ErrorBoundary } from "react-error-boundary";
import { AdminContextProvider } from './context/AdminContext';
import './global.css'; // importing is enough to apply global style to the app

export default function RootLayout({ children }: {
    children: React.ReactNode
}) {
    return (
        <html lang="en">
            <head>
                <title>HopFront</title>
            </head>
            <body>
                <ThemeProvider>
                    <ErrorBoundary FallbackComponent={ErrorBoundaryFallback}>
                        <AdminContextProvider>
                            <Navigation>
                                {children}
                            </Navigation>
                        </AdminContextProvider>
                    </ErrorBoundary>
                </ThemeProvider>
            </body>
        </html>
    )
}
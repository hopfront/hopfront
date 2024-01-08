'use client';

import ThemeProvider from "@/app/components/base/CssProvider";
import Navigation from "@/app/components/base/Navigation";
import { ErrorBoundaryFallback } from "@/app/components/misc/ErrorBoundaryFallback";
import { MatomoProvider, createInstance } from '@jonkoops/matomo-tracker-react';
import React from "react";
import { ErrorBoundary } from "react-error-boundary";
import { AdminContextProvider } from './context/AdminContext';
import './global.css'; // importing is enough to apply global style to the app

const matomoUrlBase = process.env.NEXT_PUBLIC_MATOMO_URL_BASE || 'http://localhost';
const matomoSiteId = parseInt(process.env.NEXT_PUBLIC_MATOMO_SITE_ID || '1');
const matomoDisabled = JSON.parse(process.env.NEXT_PUBLIC_MATOMO_DISABLED !== undefined ? process.env.NEXT_PUBLIC_MATOMO_DISABLED : 'true');
const matomoDisableCookies = JSON.parse(process.env.NEXT_PUBLIC_MATOMO_DISABLE_COOKIES !== undefined ? process.env.NEXT_PUBLIC_MATOMO_DISABLE_COOKIES : 'true');

const MATOMO_INSTANCE = createInstance({
    urlBase: matomoUrlBase,
    siteId: matomoSiteId,
    userId: process.env.NEXT_PUBLIC_MATOMO_USER_ID,
    disabled: matomoDisabled, // Makes all tracking calls no-ops if set to true.
    configurations: { // optional, default value: {}
        disableCookies: matomoDisableCookies,
    },
})

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
                        <MatomoProvider value={MATOMO_INSTANCE}>
                            <AdminContextProvider>
                                <Navigation>
                                    {children}
                                </Navigation>
                            </AdminContextProvider>
                        </MatomoProvider>
                    </ErrorBoundary>
                </ThemeProvider>
            </body>
        </html>
    )
}
import ColorSchemeToggle from "@/app/components/base/sidebar/ColorSchemeToggle";
import { closeSidebar } from "@/app/components/base/utils";
import { FeedbackModal } from "@/app/components/modal/FeedbackModal";
import { AdminContext, shouldShowAdminContent } from "@/app/context/AdminContext";
import {
    Dashboard,
    Explore, Feedback, Settings
} from "@mui/icons-material";
import { Stack } from "@mui/joy";
import Box from "@mui/joy/Box";
import GlobalStyles from "@mui/joy/GlobalStyles";
import IconButton from "@mui/joy/IconButton";
import Sheet from "@mui/joy/Sheet";
import { usePathname, useRouter } from "next/navigation";
import * as React from "react";
import { useState } from "react";
import { AdminAuthenticationButton } from "./AdminAuthenticationButton";

interface ListItemSelectableButtonProps {
    label: string
    icon?: React.ReactNode
    route: string
    selected: boolean
}

type SelectedMenuItem = "browse" | "dashboards" | "settings";

export default function Sidebar() {
    const adminContext = React.useContext(AdminContext);
    const router = useRouter();
    const [feedbackOpen, setFeedbackOpen] = useState(false);
    const path = usePathname();
    const segments = path.split('/');

    const getSelectedMenuItem = (): SelectedMenuItem | undefined => {
        const root = segments[1];

        if ((root === 'api-specs')) {
            if (segments.length >= 4) {
                if (segments[3] === "settings") {
                    return 'settings';
                }
            }
        } else if (root === "settings") {
            return 'settings';
        } else if (root === 'browse') {
            return 'browse';
        } else if (root === 'dashboards') {
            return 'dashboards';
        }

        return undefined;
    }

    const selectedMenuItem = getSelectedMenuItem();

    const SidebarButton = ({ label, icon, route, selected }: ListItemSelectableButtonProps) => {
        return (
            <IconButton
                title={label}
                onClick={() => router.push(route)}
                color={selected ? 'primary' : undefined}
                sx={{ mb: 1 }}>
                {icon}
            </IconButton>
        )
    }

    return (
        <Sheet
            className="Sidebar"
            sx={{
                position: {
                    xs: 'fixed',
                    md: 'sticky',
                },
                transform: {
                    xs: 'translateX(calc(100% * (var(--SideNavigation-slideIn, 0) - 1)))',
                    md: 'none',
                },
                transition: 'transform 0.4s, width 0.4s',

                height: '100dvh',
                width: 'var(--Sidebar-width)',
                top: 0,
                p: 1.5,
                py: 3,
                flexShrink: 0,
                display: 'flex',
                flexDirection: 'column',
                gap: 2,
                borderRight: '1px solid',
                borderColor: 'divider',
            }}
        >
            <GlobalStyles
                styles={(theme) => ({
                    ':root': {
                        // --Sidebar-visibility is used to resize the width of main content when switching to mobile mode
                        '--Sidebar-visibility': '0',
                        [theme.breakpoints.up('md')]: {
                            '--Sidebar-visibility': '1',
                        },
                        [theme.breakpoints.up('lg')]: {},
                    },
                })}
            />
            <Box
                className="Sidebar-overlay"
                sx={{
                    position: 'fixed',
                    zIndex: 9998,
                    top: 0,
                    left: 0,
                    bgcolor: 'background.body',
                    opacity: 'calc(var(--SideNavigation-slideIn, 0) - 0.2)',
                    transition: 'opacity 0.4s',
                    transform: {
                        xs: 'translateX(calc(100% * (var(--SideNavigation-slideIn, 0) - 1) + var(--SideNavigation-slideIn, 0) * var(--Sidebar-width, 0px)))',
                        lg: 'translateX(-100%)',
                    },
                }}
                onClick={() => closeSidebar()}
            />
            <Box
                sx={{
                    flexGrow: 1,
                    display: 'flex',
                    flexDirection: 'column',
                }}
            >
                <SidebarButton
                    route={'/browse'}
                    selected={selectedMenuItem === 'browse'}
                    icon={<Explore />}
                    label="Browse"
                />

                <SidebarButton
                    route={'/dashboards'}
                    selected={selectedMenuItem === 'dashboards'}
                    icon={<Dashboard />}
                    label="Dashboards"
                />

                {shouldShowAdminContent(adminContext) &&
                    <SidebarButton
                        route={'/settings'}
                        selected={selectedMenuItem === 'settings'}
                        icon={<Settings />}
                        label="Settings"
                    />}
            </Box>
            <Stack gap={1}>
                <IconButton
                    title="Give us feedback!"
                    onClick={() => setFeedbackOpen(true)}
                >
                    <Feedback />
                </IconButton>
                {adminContext.adminStatus?.isEnabled === true &&
                    <AdminAuthenticationButton
                        isAuthenticated={adminContext.isAuthenticated === true}
                    />}
                <ColorSchemeToggle />
            </Stack>
            <FeedbackModal open={feedbackOpen} onClose={() => setFeedbackOpen(false)} />
        </Sheet>
    );
}

'use client';

import { Box, Button, ListDivider, Typography } from "@mui/joy";
import { useContext, useState } from "react";

import { PageHeader } from "@/app/components/typography/PageHeader";
import { useAnalytics } from "@/app/hooks/analytics/useAnalytics";
import { DashboardApi } from "@/app/lib/api/DashboardApi";
import { fetcher } from "@/app/lib/api/utils";
import { DashboardList } from "@/app/lib/dto/DashboardList";
import { buildNewDashboard, Dashboard } from "@/app/lib/model/dashboard/Dashboard";
import { Dashboard as DashboardIcon } from "@mui/icons-material";
import List from "@mui/joy/List";
import ListItem from "@mui/joy/ListItem";
import ListItemButton from "@mui/joy/ListItemButton";
import { useRouter } from "next/navigation";
import useSWR from "swr";
import ThreeDotsLoader from "../components/misc/ThreeDotsLoader";
import { AdminContext, shouldShowAdminContent } from "../context/AdminContext";
import EmptyDashboardsView from "./components/EmptyDashboardsView";

export default function Page() {
    const { usePageView, registerEvent } = useAnalytics();
    const [addDashboardLoading, setAddDashboardLoading] = useState(false);
    const { data, error, isLoading } = useSWR<DashboardList>('/api/dashboards', fetcher);
    const router = useRouter();
    const adminContext = useContext(AdminContext);

    usePageView("dashboard-list-page");

    const onAddDashboardClick = () => {
        registerEvent({
            category: "dashboard",
            action: "dashboard-add-clicked"
        });

        setAddDashboardLoading(true);

        DashboardApi.createDashboard(buildNewDashboard())
            .then(async (response) => {
                if (response.ok) {
                    const dashboard = await response.json() as Dashboard
                    router.push(`/dashboards/${dashboard.id}`);
                } else {
                    setAddDashboardLoading(false);
                }
            })
            .catch(reason => {
                console.log('Error creating dashboard', reason);
                setAddDashboardLoading(false);
            })
    };

    if (isLoading || adminContext.isLoading) {
        return <Box sx={{ display: 'flex', height: "90vh", alignItems: 'center', justifyContent: 'center' }}>
            <ThreeDotsLoader />
        </Box>
    }

    if (!isLoading && data?.dashboards.length === 0) {
        return <EmptyDashboardsView
            onClick={onAddDashboardClick}
            isLoading={addDashboardLoading}
            isAddDashboardAvailable={shouldShowAdminContent(adminContext)} />
    }

    return (
        <>
            <Box display='flex' gap={2} alignItems='center' sx={{ mb: 2 }}>
                <PageHeader icon={<DashboardIcon />} text="Dashboards" />
                {shouldShowAdminContent(adminContext) &&
                    <Button
                        title="Add a new dashboard"
                        loading={addDashboardLoading}
                        onClick={onAddDashboardClick}>
                        Add
                    </Button>}
            </Box>
            <List>
                {(data?.dashboards || []).map((dashboard, index) => {
                    return (
                        <>
                            <ListItem onClick={() => null}>
                                <ListItemButton
                                    onClick={() => router.push(`/dashboards/${dashboard.id}`)}>
                                    <Typography level="title-md">{dashboard.title}</Typography>
                                </ListItemButton>
                            </ListItem>
                            {index < (data?.dashboards?.length ?? 0) - 1 &&
                                <ListDivider inset='gutter' />}
                        </>
                    );
                })}
            </List>

        </>
    );
}

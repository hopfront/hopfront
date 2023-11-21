'use client';

import {Box, Button, ListDivider, Typography} from "@mui/joy";
import {useState} from "react";

import useSWR from "swr";
import {DashboardList} from "@/app/lib/dto/DashboardList";
import {useRouter} from "next/navigation";
import {buildNewDashboard, Dashboard, NEW_DASHBOARD_ID} from "@/app/lib/model/dashboard/Dashboard";
import List from "@mui/joy/List";
import ListItem from "@mui/joy/ListItem";
import ListItemButton from "@mui/joy/ListItemButton";
import LinearProgress from "@mui/joy/LinearProgress";
import EmptyDashboardsView from "./components/EmptyDashboardsView";
import {Dashboard as DashboardIcon} from "@mui/icons-material";
import {PageHeader} from "@/app/components/typography/PageHeader";
import {useAnalytics} from "@/app/hooks/analytics/useAnalytics";
import {DashboardApi} from "@/app/lib/api/DashboardApi";
import {fetcher} from "@/app/lib/api/utils";

export default function Page() {
    const {usePageView, registerEvent} = useAnalytics();
    const [addDashboardLoading, setAddDashboardLoading] = useState(false);
    const {data, error, isLoading} = useSWR<DashboardList>('/api/dashboards', fetcher);
    const router = useRouter();

    usePageView("dashboard-list-page");

    throw new Error('hehe');

    const onAddDashboardClick = () => {
        registerEvent({
            category: "dashboard",
            action: "dashboard-add-clicked"
        });

        setAddDashboardLoading(true);

        DashboardApi.createDashboard(buildNewDashboard())
            .then((savedNewDashboard: Dashboard) => {
                router.push(`/dashboards/${savedNewDashboard.id}`);
            })
            .catch(reason => {
                console.log('Error creating dashboard', reason);
                setAddDashboardLoading(false);
            });
        router.push(`/dashboards/${NEW_DASHBOARD_ID}`);
    };

    if (!isLoading && data?.dashboards.length === 0) {
        return <EmptyDashboardsView onClick={onAddDashboardClick} isLoading={addDashboardLoading}/>
    }

    return (
        <>
            <Box display='flex' gap={2} alignItems='center' sx={{mb: 2}}>
                <PageHeader icon={<DashboardIcon/>} text="Dashboards"/>
                <Button
                    title="Add a new dashboard"
                    loading={addDashboardLoading}
                    onClick={onAddDashboardClick}>
                    Add
                </Button>
            </Box>
            {isLoading
                ? <Box><LinearProgress/></Box>
                : <List>
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
                                    <ListDivider inset='gutter'/>}
                            </>
                        );
                    })}

                </List>}

        </>
    );
}

'use client';

import { ErrorAlert } from "@/app/components/operation/response/ErrorAlert";
import { DashboardPage } from "@/app/dashboards/[dashboardId]/components/DashboardPage";
import { useAnalytics } from "@/app/hooks/analytics/useAnalytics";
import { EventType, useSnackbar } from "@/app/hooks/useSnackbar";
import { DashboardApi } from "@/app/lib/api/DashboardApi";
import { Dashboard } from "@/app/lib/model/dashboard/Dashboard";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function Page() {
    const params = useParams();
    const {usePageView} = useAnalytics();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<any | undefined>();
    const [dashboard, setDashboard] = useState<Dashboard | undefined>();
    const {showSnackbar, Snackbar} = useSnackbar();

    const dashboardId = params['dashboardId'];

    usePageView("/dashboards/:id");

    useEffect(() => {
        setLoading(true);
        DashboardApi.getDashboard(dashboardId as string)
            .then(dashboard => {
                setDashboard(dashboard);
                setLoading(false);
            })
            .catch(reason => {
                setError(reason);
                setLoading(false);
            });
    }, [dashboardId]);

    const onSaveDashboard = (dashboard: Dashboard) => {
        DashboardApi.updateDashboard(dashboard)
            .then(() => {
                showSnackbar(EventType.Success, 'Dashboard updated successfully');
                setDashboard(dashboard);
            })
            .catch(error => {
                showSnackbar(EventType.Error, `Failed to update dashboard: ${error.toLocaleString()}`)
                setError(error);
            });
    }

    if (error) {
        return <ErrorAlert error={error} onClose={() => setError(undefined)}/>;
    } else {
        return (
            <>
                <DashboardPage dashboard={dashboard} loading={loading} onSave={onSaveDashboard}/>
                {Snackbar}
            </>
        );
    }

}

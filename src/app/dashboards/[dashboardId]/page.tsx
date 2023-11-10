'use client';

import {useEffect, useState} from "react";
import {Dashboard} from "@/app/lib/model/dashboard/Dashboard";
import {DashboardPage} from "@/app/dashboards/[dashboardId]/components/DashboardPage";
import {useParams} from "next/navigation";
import {useAnalytics} from "@/app/hooks/analytics/useAnalytics";
import {DashboardApi} from "@/app/lib/api/DashboardApi";
import {ErrorAlert} from "@/app/components/operation/response/ErrorAlert";

export default function Page() {
    const params = useParams();
    const {usePageView} = useAnalytics();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<any | undefined>();
    const [dashboard, setDashboard] = useState<Dashboard | undefined>();

    const dashboardId = params['dashboardId'];

    usePageView("dashboard-page");

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
                setDashboard(dashboard);
            })
            .catch(error => {
                setError(error);
            });
    }

    if (error) {
        return <ErrorAlert error={error} onClose={() => setError(undefined)}/>;
    } else {
        return <DashboardPage dashboard={dashboard} loading={loading} onSave={onSaveDashboard}/>;
    }

}

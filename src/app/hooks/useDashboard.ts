import useSWR from "swr";
import {Dashboard} from "@/app/lib/model/dashboard/Dashboard";
import {fetcher} from "@/app/lib/api/utils";

export const useDashboard = (dashboardId: string | undefined) => {
    const { data, error, isLoading } =
        useSWR<Dashboard>(dashboardId ? `/api/dashboards/${dashboardId}` : null, fetcher);

    return {
        dashboard: data,
        error: error,
        isLoading: isLoading
    };
}
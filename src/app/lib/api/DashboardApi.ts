import { Dashboard } from "@/app/lib/model/dashboard/Dashboard";
import { mutate } from "swr";

export async function mutateDashboard(dashboardId: string) {
    return await mutate(`/api/dashboards/${dashboardId}`);
}

export class DashboardApi {

    public static async createDashboard(dashboard: Dashboard): Promise<Response> {
        return fetch('/api/dashboards', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(dashboard),
        })
    }

    public static async getDashboard(dashboardId: string) {
        return fetch(`/api/dashboards/${dashboardId}`)
            .then(response => response.json())
            .then((body: Dashboard) => {
                return body;
            });
    }

    public static async updateDashboard(dashboard: Dashboard) {
        await fetch(`/api/dashboards/${dashboard.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(dashboard),
        });

        return await mutateDashboard(dashboard.id);
    }

    public static async deleteDashboard(dashboardId: string) {
        return fetch(`/api/dashboards/${dashboardId}`, {
            method: 'DELETE'
        });
    }
}
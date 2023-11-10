import {Dashboard} from "@/app/lib/model/dashboard/Dashboard";

export class DashboardApi {

    public static async createDashboard(dashboard: Dashboard): Promise<Dashboard> {
        return fetch('/api/dashboards', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(dashboard),
        })
            .then(response => response.json());
    }

    public static async getDashboard(dashboardId: string) {
        return fetch(`/api/dashboards/${dashboardId}`)
            .then(response => response.json())
            .then((body: Dashboard) => {
                return body;
            });
    }

    public static async updateDashboard(dashboard: Dashboard) {
        return fetch(`/api/dashboards/${dashboard.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(dashboard),
        });
    }

    public static async deleteDashboard(dashboardId: string) {
        return fetch(`/api/dashboards/${dashboardId}`, {
            method: 'DELETE'
        });
    }
}
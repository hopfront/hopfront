import {deleteDirectory, fileExists, listDirectoryChildren, readFile, writeFile} from "@/app/api/lib/repository/utils";
import {randomInternalId} from "@/app/lib/openapi/utils";
import {Dashboard} from "@/app/lib/model/dashboard/Dashboard";

export class DashboardRepository {

    static getDashboard(id: string): Dashboard | undefined {
        return this.listDashboards().find(value => value.id === id);
    }

    static listDashboards(): Dashboard[] {
        return listDirectoryChildren('dashboards')
            .map(dashboardId => {
                const dashboardSpecText = readFile(`/dashboards/${dashboardId}`, '/spec.json');
                const unsafeDashboard = JSON.parse(dashboardSpecText) as Dashboard;
                return {
                    id: unsafeDashboard.id,
                    title: unsafeDashboard.title,
                    variables: unsafeDashboard.variables || [],
                    panels: unsafeDashboard.panels || [],
                };
            })
    }

    static createDashboard(title: string): Dashboard {
        let generatedId = randomInternalId(4);

        while (fileExists('dashboards', generatedId)) {
            console.log(`Dashboard with id=${generatedId} already exists, generating new id...`);
        }

        const dashboard = {
            id: generatedId,
            title: title,
            variables: [],
            panels: []
        } as Dashboard;

        DashboardRepository.saveDashboard(generatedId, dashboard);

        return dashboard;
    }

    static saveDashboard(dashboardId: string, dashboard: Dashboard) {
        if (dashboardId !== dashboard.id) {
            throw new Error("Dashboard id mismatch");
        }

        writeFile(`dashboards/${dashboardId}`, 'spec.json', JSON.stringify(dashboard));
        console.log(`Saved dashboard with id=${dashboardId}`);
        return dashboard;
    }

    static deleteDashboard(dashboardId: string) {
        deleteDirectory(`dashboards/${dashboardId}`);
    }
}
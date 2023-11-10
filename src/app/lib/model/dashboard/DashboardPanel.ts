import {DashboardPanelConfig} from "@/app/lib/model/dashboard/DashboardPanelConfig";
import {DashboardPanelType} from "@/app/lib/model/dashboard/DashboardPanelType";
import {Dashboard} from "@/app/lib/model/dashboard/Dashboard";
import {randomInternalId} from "@/app/lib/openapi/utils";
import {DashboardPanelVisualizationConfig} from "@/app/lib/model/dashboard/DashboardPanelVisualizationConfig";
import {DashboardPanelChartConfig} from "@/app/lib/model/dashboard/DashboardPanelChartConfig";

export interface DashboardPanel {
    id: string
    title: string
    type: DashboardPanelType
    config: DashboardPanelConfig
}

export const buildDashboardNewPanelId = (dashboard: Dashboard): string => {
    let generatedPanelId = randomInternalId(3);

    while (dashboard.panels.find(p => p.id === generatedPanelId)) {
        generatedPanelId = randomInternalId(3);
    }

    return generatedPanelId;
}

export const buildNewVisualizationPanel = (panelId: string, panelName: string): DashboardPanel => {
    return {
        id: panelId,
        title: panelName,
        type: "Visualization",
        config: {
            apiSpecId: undefined,
            operationId: undefined,
            inputs: [],
        } as DashboardPanelVisualizationConfig,
    };
};

export const newChartDataConfig = (): DashboardPanelChartConfig => {
    return {
        apiSpecId: undefined,
        operationId: undefined,
        inputs: [],
        chartDataConfig: undefined,
    }
};
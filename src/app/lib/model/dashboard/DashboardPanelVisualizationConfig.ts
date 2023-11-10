import {DashboardPanelInput} from "@/app/lib/model/dashboard/DashboardPanelInput";

export interface DashboardPanelVisualizationConfig {
    apiSpecId: string | undefined
    operationId: string | undefined
    inputs: DashboardPanelInput[]
}
import {DashboardPanelInput} from "@/app/lib/model/dashboard/DashboardPanelInput";
import {ChartDataConfig} from "@/app/lib/model/chart/ChartDataConfig";

export interface DashboardPanelChartConfig {
    apiSpecId: string | undefined
    operationId: string | undefined
    inputs: DashboardPanelInput[]
    chartDataConfig?: ChartDataConfig
}
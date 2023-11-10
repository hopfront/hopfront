import {
    DashboardPanelOperationResponseContent
} from "@/app/dashboards/[dashboardId]/components/DashboardPanelOperationResponseContent";
import {StandaloneOperation} from "@/app/lib/model/StandaloneOperation";
import {OperationAsyncResponse} from "@/app/dashboards/[dashboardId]/components/DashboardPanelGridItem";
import {ApiContext} from "@/app/lib/model/ApiContext";
import {DashboardPanel} from "@/app/lib/model/dashboard/DashboardPanel";
import {DashboardPanelChartContent} from "@/app/dashboards/[dashboardId]/components/chart/DashboardPanelChartContent";

export interface DashboardPanelContentProps {
    panel: DashboardPanel
    operation: StandaloneOperation
    response: OperationAsyncResponse
    apiContext: ApiContext
}

export const DashboardPanelContent = ({panel, operation, response, apiContext}: DashboardPanelContentProps) => {
    switch (panel.type) {
        case "Visualization": {
            return <DashboardPanelOperationResponseContent
                operation={operation}
                operationResponse={response}
                apiContext={apiContext}/>;
        }
        case "chart": {
            return <DashboardPanelChartContent
                panel={panel}
                operation={operation}
                response={response}
                apiContext={apiContext}/>
        }
        default: return <></>
    }
}
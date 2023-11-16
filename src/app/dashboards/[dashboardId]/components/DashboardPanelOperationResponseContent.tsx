import {OperationResponse} from "@/app/components/operation/response/OperationResponse";
import {OperationAsyncResponse} from "@/app/dashboards/[dashboardId]/components/DashboardPanelGridItem";
import {StandaloneOperation} from "@/app/lib/model/StandaloneOperation";
import {ApiContext} from "@/app/lib/model/ApiContext";

export interface DashboardPanelOperationResponseContentProps {
    operation: StandaloneOperation
    operationResponse: OperationAsyncResponse
    apiContext: ApiContext
}

export const DashboardPanelOperationResponseContent = ({
                                                           operation,
                                                           operationResponse,
                                                           apiContext
                                                       }: DashboardPanelOperationResponseContentProps) => {

    if (!operationResponse.response) {
        return null;
    }

    return (
        <OperationResponse
            operation={operation}
            response={operationResponse.response}
            onRefreshNeeded={() => null}
            loading={operationResponse.loading}
            apiContext={apiContext}/>
    );
}
import {Dashboard} from "@/app/lib/model/dashboard/Dashboard";
import {DashboardPanelGridItem} from "@/app/dashboards/[dashboardId]/components/DashboardPanelGridItem";
import {VariableWithValue} from "@/app/lib/model/dashboard/VariableWithValue";
import {RefreshObserverRegistry} from "@/app/lib/model/RefreshObserverRegistry";
import {AspectRatio, Box, Skeleton} from "@mui/joy";
import {DashboardPanel} from "@/app/lib/model/dashboard/DashboardPanel";
import React, {useState} from "react";
import {ApiContext} from "@/app/lib/model/ApiContext";
import {AuthenticationGuard} from "@/app/components/authentication/AuthenticationGuard";
import {
    DashboardPanelInputSourceConfigDataVariable
} from "@/app/lib/model/dashboard/DashboardPanelInputSourceConfigDataVariable";

interface AuthRequiredContext {
    operationId: string
    apiContext: ApiContext
}

export interface DashboardPanelGridProps {
    dashboard?: Dashboard
    variables: VariableWithValue[]
    refreshObserverRegistry: RefreshObserverRegistry
    onPanelEditClick: (panel: DashboardPanel) => void
    onPanelDeleteClick: (panel: DashboardPanel) => void
    onPanelTitleChanged: (panel: DashboardPanel) => void
}

export const DashboardPanelGrid = ({
                                       dashboard,
                                       variables,
                                       refreshObserverRegistry,
                                       onPanelEditClick,
                                       onPanelDeleteClick,
                                       onPanelTitleChanged
                                   }: DashboardPanelGridProps) => {

    const [authRequiredContext, setAuthRequiredContext] = useState<AuthRequiredContext | undefined>();

    if (!dashboard) {
        return <AspectRatio maxHeight="200px">
            <Skeleton>
                <img
                    alt=""
                    src="data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs="
                />
            </Skeleton>
        </AspectRatio>
    }

    const panels = (dashboard?.panels || []).map(panel => {
        const relevantVariables = variables.filter(v => {
            const inputsUsingThisVariable = panel.config.inputs.filter(input => {
                if (input.sourceConfig.type === "variable") {
                    const inputVariableData = input.sourceConfig.data as DashboardPanelInputSourceConfigDataVariable;
                    return inputVariableData.variableName === v.variable.name;
                } else {
                    return false;
                }
            });

            return inputsUsingThisVariable.length > 0;
        });

        return <Box key={'panel-' + panel.id} sx={{mb: 2}}>
            <DashboardPanelGridItem
                panel={panel}
                variables={relevantVariables}
                refreshObserverRegistry={refreshObserverRegistry}
                onAuthRequired={apiContext => {
                    if (authRequiredContext?.apiContext.apiSpec.id !== apiContext.apiSpec.id) {
                        setAuthRequiredContext({
                            operationId: panel.config.operationId!,
                            apiContext: apiContext
                        });
                    }
                }}
                onEditClick={() => onPanelEditClick(panel)}
                onDeleteClick={() => onPanelDeleteClick(panel)}
                onPanelTitleChanged={onPanelTitleChanged}/>
        </Box>;
    });

    if (authRequiredContext) {
        return (
            <AuthenticationGuard
                operationId={authRequiredContext.operationId}
                apiContext={authRequiredContext.apiContext}>

                {panels}
            </AuthenticationGuard>
        );
    } else {
        return panels;
    }
}
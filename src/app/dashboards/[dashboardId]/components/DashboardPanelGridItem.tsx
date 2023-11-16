import {DashboardPanel} from "@/app/lib/model/dashboard/DashboardPanel";
import {getStandaloneOperation} from "@/app/lib/openapi/utils";
import {ParameterWithValue} from "@/app/lib/model/ParameterWithValue";

import {DashboardPanelInput} from "@/app/lib/model/dashboard/DashboardPanelInput";
import {
    DashboardPanelInputSourceConfigDataConstant
} from "@/app/lib/model/dashboard/DashboardPanelInputSourceConfigDataConstant";
import {useApiContext} from "@/app/hooks/useApiContext";
import {OperationInputs} from "@/app/lib/model/OperationInputs";
import {
    DashboardPanelInputSourceConfigDataVariable
} from "@/app/lib/model/dashboard/DashboardPanelInputSourceConfigDataVariable";
import {VariableWithValue} from "@/app/lib/model/dashboard/VariableWithValue";
import {DashboardPanelConfig} from "@/app/lib/model/dashboard/DashboardPanelConfig";
import {StandaloneOperation} from "@/app/lib/model/StandaloneOperation";
import {useEffect, useMemo, useState} from "react";
import {OpenAPIV3} from "openapi-types";
import {OperationService} from "@/app/lib/service/OperationService";
import {WarningAlert} from "@/app/components/alert/WarningAlert";
import ParameterObject = OpenAPIV3.ParameterObject;
import {RefreshObserverRegistry} from "@/app/lib/model/RefreshObserverRegistry";
import {DashboardPanelContainer} from "@/app/dashboards/[dashboardId]/components/DashboardPanelContainer";
import {ErrorAlert} from "@/app/components/operation/response/ErrorAlert";
import {ApiContext} from "@/app/lib/model/ApiContext";
import {AuthService} from "@/app/lib/service/AuthService";
import {DashboardPanelContent} from "@/app/dashboards/[dashboardId]/components/DashboardPanelContent";

export interface OperationAsyncResponse {
    response: Response | undefined
    error: any | undefined
    loading: boolean
}

const getInputValue = (input: DashboardPanelInput, variables: VariableWithValue[]) => {
    switch (input.sourceConfig.type) {
        case "constant":
            return (input.sourceConfig.data as DashboardPanelInputSourceConfigDataConstant).value;
        case "variable": {
            const data = input.sourceConfig.data as DashboardPanelInputSourceConfigDataVariable;
            const variable = variables.find(v => v.variable.name === data.variableName);
            if (variable) {
                return variable.value;
            } else {
                return undefined;
            }
        }
        default:
            return undefined;
    }
}

const operationInputs = (config: DashboardPanelConfig, operation: StandaloneOperation | undefined, variables: VariableWithValue[]): OperationInputs => {
    return {
        body: undefined,
        parameters: config.inputs.flatMap(input => {
            if (!operation) {
                return [];
            }

            const parameter = operation.operation.parameters?.find(p => {
                const parameterObject = p as ParameterObject;
                return parameterObject.name === input.name;
            });

            if (parameter) {
                return [{
                    parameter: parameter,
                    value: getInputValue(input, variables),
                    readonly: true,
                } as ParameterWithValue];
            } else {
                return [];
            }
        }),
    } as OperationInputs;
};

export interface DashboardPanelGridItemProps {
    panel: DashboardPanel
    variables: VariableWithValue[]
    refreshObserverRegistry: RefreshObserverRegistry
    onAuthRequired: (apiContext: ApiContext) => void
    onEditClick: () => void
    onDeleteClick: () => void
}

export const DashboardPanelGridItem = ({
                                           panel,
                                           variables,
                                           refreshObserverRegistry,
                                           onAuthRequired,
                                           onEditClick,
                                           onDeleteClick
                                       }: DashboardPanelGridItemProps) => {

    const {data: apiContext, error, isLoading} = useApiContext(panel.config.apiSpecId);

    const authStatus = AuthService.getApiAuthenticationStatus(apiContext);

    const operation = useMemo(() => {
        return apiContext && getStandaloneOperation(panel.config.operationId!, apiContext.apiSpec);
    }, [apiContext, panel.config.operationId]);

    const inputs = useMemo(() => {
        return operationInputs(panel.config, operation, variables);
    }, [operation, panel.config, variables]);

    const [operationResponse, setOperationResponse] = useState<OperationAsyncResponse>({
        response: undefined,
        error: undefined,
        loading: false
    });

    const [refreshCount, setRefreshCount] = useState(0);

    refreshObserverRegistry.addObserver({
        onRefresh: () => setRefreshCount(refreshCount + 1)
    });

    useEffect(() => {
        if (!operation || !apiContext) {
            return;
        }

        const parameterWithoutRequiredValue = inputs.parameters.find(p => {
            return !p.value && p.parameter.required;
        });

        if (parameterWithoutRequiredValue) {
            return;
        }

        setOperationResponse({
            ...operationResponse,
            error: undefined,
            loading: true
        });

        OperationService.executeOperation(inputs, operation, apiContext)
            .then(response => {
                setOperationResponse({
                    response: response,
                    error: undefined,
                    loading: false,
                });
            })
            .catch(reason => {
                setOperationResponse({
                    response: undefined,
                    error: reason,
                    loading: false,
                });
            });
    }, [apiContext, inputs, operation, refreshCount]);

    if (apiContext && authStatus.isAuthenticationRequired && !authStatus.isAuthenticated) {
        onAuthRequired(apiContext);
    }

    const parameterWithoutRequiredValue = inputs.parameters.find(p => {
        return !p.value && p.parameter.required;
    });

    if (parameterWithoutRequiredValue) {
        return (
            <DashboardPanelContainer title={panel.title} loading={isLoading || operationResponse.loading}
                                     onEditClick={onEditClick} onDeleteClick={onDeleteClick}>
                <WarningAlert title={`Missing parameter '${parameterWithoutRequiredValue.parameter.name}'`}/>
            </DashboardPanelContainer>
        );
    } else if (error || operationResponse.error) {
        return (
            <DashboardPanelContainer title={panel.title} loading={isLoading || operationResponse.loading}
                                     onEditClick={onEditClick} onDeleteClick={onDeleteClick}>
                <ErrorAlert error={error || operationResponse.error}/>
            </DashboardPanelContainer>
        );
    } else if (apiContext && operation) {
        return (
            <DashboardPanelContainer
                title={panel.title}
                loading={isLoading || operationResponse.loading}
                onEditClick={onEditClick}
                onDeleteClick={onDeleteClick}>

                <DashboardPanelContent
                    panel={panel}
                    operation={operation}
                    response={operationResponse}
                    apiContext={apiContext}/>
            </DashboardPanelContainer>
        );
    } else {
        return null;
    }
}
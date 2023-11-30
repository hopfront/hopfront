import { OperationInputForm } from "@/app/components/operation/OperationInputForm";
import { ErrorAlert } from "@/app/components/operation/response/ErrorAlert";
import { useAnalytics } from "@/app/hooks/analytics/useAnalytics";
import { ApiContext } from "@/app/lib/model/ApiContext";
import { OperationInputs } from "@/app/lib/model/OperationInputs";
import { ResponseSchemaSelectedObserver } from "@/app/lib/model/ResponseSchemaSelectedObserver";
import { StandaloneOperation } from "@/app/lib/model/StandaloneOperation";
import { getOperationDefaultInputs } from "@/app/lib/openapi/utils";
import { OperationService } from "@/app/lib/service/OperationService";
import Card from "@mui/joy/Card";
import { useEffect, useState } from "react";
import { OperationResponse } from "./response/OperationResponse";

export interface OperationGetWidgetProps {
    operation: StandaloneOperation
    defaultInputs?: OperationInputs
    onResponse?: (response: Response) => void
    onError?: (error: any) => void
    responseSchemaSelectedObserver?: ResponseSchemaSelectedObserver
    apiContext: ApiContext
}

const buildOperationInputsCacheKey = (operation: StandaloneOperation) => {
    return `operation:${operation.getOperationId()}:inputs-cache`;
}

const getCachedInputs = (operation: StandaloneOperation) => {
    const cachedInputsString = localStorage.getItem(buildOperationInputsCacheKey(operation));
    return cachedInputsString && JSON.parse(cachedInputsString);
}

const cacheInputs = (operation: StandaloneOperation, operationInput: OperationInputs) => {
    localStorage.setItem(buildOperationInputsCacheKey(operation), JSON.stringify(operationInput));
}

export const OperationGetWidget = ({
                                       operation,
                                       defaultInputs,
                                       onResponse,
                                       onError,
                                       responseSchemaSelectedObserver,
                                       apiContext
                                   }: OperationGetWidgetProps) => {

    const {registerEvent} = useAnalytics();
    const [operationInputs, setOperationInputs] =
        useState<OperationInputs>(getOperationDefaultInputs(operation, defaultInputs || getCachedInputs(operation)));
    const [loading, setLoading] = useState(false);
    const [response, setResponse] = useState<Response | undefined>();
    const [error, setError] = useState<Error | undefined>();
    const [refreshCounter, setRefreshCounter] = useState(0); // little trick to force refresh

    const onOperationInputsChange = (operationInputs: OperationInputs) => {
        cacheInputs(operation, operationInputs);
        setOperationInputs(operationInputs);
    }

    useEffect(() => {
        setOperationInputs(getOperationDefaultInputs(operation, defaultInputs || getCachedInputs(operation)));
    }, [defaultInputs, operation]);

    useEffect(() => {
        const parameterWithoutRequiredValue = operationInputs.parameters.find(p => {
            return !p.value && p.parameter.required;
        });

        if (parameterWithoutRequiredValue) {
            return; // We don't execute the request if any parameter is missing its value.
        }

        setLoading(true);
        setError(undefined);

        registerEvent({
            category: 'browse',
            action: 'browse',
            name: operation.method,
        });

        OperationService.executeOperation(operationInputs, operation, apiContext)
            .then(response => {
                setResponse(response);
                setLoading(false);
                onResponse && onResponse(response);
            })
            .catch(reason => {
                setError(reason);
                setResponse(undefined);
                setLoading(false);
                onError && onError(reason);
            });
    }, [apiContext.apiSpec, onError, onResponse, operation, operationInputs, refreshCounter]);

    return (
        <>
            <OperationInputForm
                operation={operation}
                operationInputs={operationInputs}
                loading={loading}
                debounceMillis={500}
                onChange={onOperationInputsChange}
                apiContext={apiContext}/>
            {response &&
                <Card sx={{mt: 2}}>
                    <OperationResponse
                        operation={operation}
                        response={response}
                        onRefreshNeeded={() => {
                            setRefreshCounter(refreshCounter + 1);
                        }}
                        loading={loading}
                        responseSchemaSelectedObserver={responseSchemaSelectedObserver}
                        apiContext={apiContext}/>
                </Card>

            }
            <ErrorAlert error={error} apiContext={apiContext}/>
        </>
    );
}
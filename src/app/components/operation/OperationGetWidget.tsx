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
    const [operationInput, setOperationInput] =
        useState<OperationInputs>(getOperationDefaultInputs(operation, defaultInputs || getCachedInputs(operation)));
    const [loading, setLoading] = useState(false);
    const [response, setResponse] = useState<Response | undefined>();
    const [error, setError] = useState<Error | undefined>();
    const [refreshCounter, setRefreshCounter] = useState(0); // little trick to force refresh

    const onOperationInputChange = (operationInput: OperationInputs) => {
        cacheInputs(operation, operationInput);
        setOperationInput(operationInput);
    }

    useEffect(() => {
        setOperationInput(getOperationDefaultInputs(operation, defaultInputs || getCachedInputs(operation)));
    }, [defaultInputs, operation]);

    useEffect(() => {
        const parameterWithoutRequiredValue = operationInput.parameters.find(p => {
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

        OperationService.executeOperation(operationInput, operation, apiContext.config, apiContext.extension)
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
    }, [apiContext.apiSpec, onError, onResponse, operation, operationInput, refreshCounter]);

    return (
        <>
            <OperationInputForm
                operation={operation}
                operationInputs={operationInput}
                loading={loading}
                debounceMillis={500}
                onChange={onOperationInputChange}
                apiContext={apiContext}/>
            {response &&
                <Card sx={{mt: 2}}>
                    <OperationResponse
                        response={response}
                        onRefreshNeeded={() => {
                            setRefreshCounter(refreshCounter + 1);
                        }}
                        openAPIResponses={operation.operation.responses}
                        loading={loading}
                        responseSchemaSelectedObserver={responseSchemaSelectedObserver}
                        apiContext={apiContext}/>
                </Card>

            }
            <ErrorAlert error={error}/>
        </>
    );
}
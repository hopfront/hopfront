import { OperationInputForm } from "@/app/components/operation/OperationInputForm";
import { useAnalytics } from "@/app/hooks/analytics/useAnalytics";
import { ApiContext } from "@/app/lib/model/ApiContext";
import { OperationInputs } from "@/app/lib/model/OperationInputs";
import { ResponseSchemaSelectedObserver } from "@/app/lib/model/ResponseSchemaSelectedObserver";
import { StandaloneOperation } from "@/app/lib/model/StandaloneOperation";
import { getOperationDefaultInputs } from "@/app/lib/openapi/utils";
import { OperationService } from "@/app/lib/service/OperationService";
import { Box } from "@mui/joy";
import Card from "@mui/joy/Card";
import LinearProgress from "@mui/joy/LinearProgress";
import { useState } from "react";
import { OperationResponse } from "./response/OperationResponse";

export interface OperationDeleteWidgetProps {
    operation: StandaloneOperation
    defaultInputs?: OperationInputs
    onResponse?: (response: Response) => void
    onError?: (error: any) => void
    responseSchemaSelectedObserver?: ResponseSchemaSelectedObserver
    apiContext: ApiContext
}

export const OperationDeleteWidget = ({
                                          operation,
                                          defaultInputs,
                                          onResponse,
                                          onError,
                                          responseSchemaSelectedObserver,
                                          apiContext
                                      }: OperationDeleteWidgetProps) => {

    const {registerEvent} = useAnalytics()
    const [operationInputs, setOperationInputs] =
        useState<OperationInputs>(getOperationDefaultInputs(operation, defaultInputs));
    const [loading, setLoading] = useState(false);
    const [response, setResponse] = useState<Response | undefined>();
    const [error, setError] = useState<Error | undefined>();

    const onSubmit = () => {
        const parameterWithoutValue = operationInputs.parameters.find(p => {
            return !p.value && p.parameter.required;
        });

        if (parameterWithoutValue) {
            return; // We don't execute the request if any parameter is missing its value.
        }

        registerEvent({
            category: 'operation',
            action: 'execute',
            name: operation.method,
        });

        setError(undefined);
        setResponse(undefined);
        setLoading(true);

        OperationService.executeOperation(operationInputs, operation, apiContext.config, apiContext.extension)
            .then(response => {
                setError(undefined);
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
    };

    return (
        <>
            <OperationInputForm
                operation={operation}
                operationInputs={operationInputs}
                loading={loading}
                onChange={input => setOperationInputs(input)}
                onSubmit={onSubmit}
                apiContext={apiContext}/>
            {loading &&
                <LinearProgress sx={{mt: 1}}/>}
            {response &&
                <Box sx={{mt: 1}}>
                    <Card>
                        <OperationResponse
                            response={response}
                            onRefreshNeeded={() => null}
                            loading={loading}
                            openAPIResponses={operation.operation.responses}
                            responseSchemaSelectedObserver={responseSchemaSelectedObserver}
                            apiContext={apiContext}
                        />
                    </Card>
                </Box>}
            {error &&
                <p style={{color: 'red'}}>An error occurred: {JSON.stringify(error.message)}</p>}
        </>
    );
}
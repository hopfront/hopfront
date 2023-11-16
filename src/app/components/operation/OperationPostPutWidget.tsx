import { OperationInputForm } from "@/app/components/operation/OperationInputForm";
import { OperationResponse } from "@/app/components/operation/response/OperationResponse";
import { useAnalytics } from "@/app/hooks/analytics/useAnalytics";
import { ApiContext } from "@/app/lib/model/ApiContext";
import { OperationInputs } from "@/app/lib/model/OperationInputs";
import { ResponseSchemaSelectedObserver } from "@/app/lib/model/ResponseSchemaSelectedObserver";
import { StandaloneOperation } from "@/app/lib/model/StandaloneOperation";
import { getOperationDefaultInputs } from "@/app/lib/openapi/utils";
import { OperationService } from "@/app/lib/service/OperationService";
import { Box, Card } from "@mui/joy";
import LinearProgress from "@mui/joy/LinearProgress";
import { useState } from "react";

export interface OperationPostPutWidgetProps {
    operation: StandaloneOperation
    defaultInputs?: OperationInputs
    onResponse?: (response: Response) => void
    onError?: (error: any) => void
    responseSchemaSelectedObserver?: ResponseSchemaSelectedObserver
    apiContext: ApiContext
}

export const OperationPostPutWidget = ({
                                           operation,
                                           defaultInputs,
                                           onResponse,
                                           onError,
                                           responseSchemaSelectedObserver,
                                           apiContext
                                       }: OperationPostPutWidgetProps) => {

    const {registerEvent} = useAnalytics();
    const [operationInputs, setOperationInputs] =
        useState(getOperationDefaultInputs(operation, defaultInputs));
    const [loading, setLoading] = useState(false);
    const [response, setResponse] = useState<Response | undefined>();
    const [error, setError] = useState<any | undefined>();

    const onSubmit = () => {
        const parameterWithoutRequiredValue = operationInputs.parameters.find(p => {
            return !p.value && p.parameter.required;
        });

        if (parameterWithoutRequiredValue) {
            setError("You should fill in all the required fields")
            return; // We don't execute the request if any parameter is missing its value.
        }

        registerEvent({
            category: 'operation',
            action: 'execute',
            name: operation.method
        });

        setError(null);
        setResponse(undefined);
        setLoading(true);

        OperationService.executeOperation(operationInputs, operation, apiContext.config, apiContext.extension)
            .then(response => {
                setError(null);
                setResponse(response);
                setLoading(false);
                onResponse && onResponse(response);
            })
            .catch(reason => {
                setError(reason);
                setResponse(undefined);
                setLoading(false);
                onError && onError(reason);
            })
    }

    return (
        <>
            <OperationInputForm
                operation={operation}
                operationInputs={operationInputs}
                loading={loading}
                onChange={input => {
                    setOperationInputs(input);
                }}
                onSubmit={onSubmit}
                apiContext={apiContext}
            />
            {loading &&
                <LinearProgress sx={{mt: 1}}/>}
            {response &&
                <Box sx={{mt: 2}}>
                    <Card>
                        <OperationResponse
                            operation={operation}
                            response={response}
                            onRefreshNeeded={() => null}
                            loading={loading}
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
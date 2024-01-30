import { OperationDeleteWidget } from "@/app/components/operation/OperationDeleteWidget";
import { OperationGetWidget } from "@/app/components/operation/OperationGetWidget";
import { OperationPostPutWidget } from "@/app/components/operation/OperationPostPutWidget";
import { OpenAPIV3 } from "openapi-types";
import HttpMethods = OpenAPIV3.HttpMethods;
import { OperationInputs } from "@/app/lib/model/OperationInputs";
import { AuthenticationGuard } from "@/app/components/authentication/AuthenticationGuard";
import { ResponseSchemaSelectedObserver } from "@/app/lib/model/ResponseSchemaSelectedObserver";
import { StandaloneOperation } from "@/app/lib/model/StandaloneOperation";
import { ApiContext } from "@/app/lib/model/ApiContext";
import { OperationHeader } from "./OperationHeader";
import { Box } from "@mui/joy";

export interface ApiOperationWidgetProps {
    operation: StandaloneOperation
    defaultInputs?: OperationInputs
    onResponse?: (response: Response) => void
    onError?: (error: any) => void
    responseSchemaSelectedObserver?: ResponseSchemaSelectedObserver
    apiContext: ApiContext,
    shouldGetOperationAutoSubmit: boolean
}

export const ApiOperationWidget = ({
    operation,
    defaultInputs,
    onResponse,
    onError,
    responseSchemaSelectedObserver,
    apiContext,
    shouldGetOperationAutoSubmit = true
}: ApiOperationWidgetProps) => {

    const getOperationWidget = () => {
        switch (operation.method) {
            case HttpMethods.GET:
                return <OperationGetWidget
                    key={`operation:${operation.path}:method:${operation.method}`}
                    operation={operation}
                    defaultInputs={defaultInputs}
                    onResponse={onResponse}
                    onError={onError}
                    responseSchemaSelectedObserver={responseSchemaSelectedObserver}
                    apiContext={apiContext}
                    shouldAutoSubmit={shouldGetOperationAutoSubmit}/>;
            case HttpMethods.POST:
            case HttpMethods.PUT:
                return <OperationPostPutWidget
                    key={`operation:${operation.path}:method:${operation.method}`}
                    operation={operation}
                    defaultInputs={defaultInputs}
                    onResponse={onResponse}
                    onError={onError}
                    responseSchemaSelectedObserver={responseSchemaSelectedObserver}
                    apiContext={apiContext} />;
            case HttpMethods.DELETE:
                return <OperationDeleteWidget
                    key={`operation:${operation.path}:method:${operation.method}`}
                    operation={operation}
                    defaultInputs={defaultInputs}
                    onResponse={onResponse}
                    onError={onError}
                    responseSchemaSelectedObserver={responseSchemaSelectedObserver}
                    apiContext={apiContext} />;
            default:
                return <div>not handled</div>;
        }
    }

    return (
        <>
            <AuthenticationGuard operationId={operation.getOperationId()} apiContext={apiContext}>
                <Box sx={{ height: '100%', overflow: 'scroll', px: 3, py: 3 }}>
                    <OperationHeader operation={operation} apiContext={apiContext} />
                    {getOperationWidget()}
                </Box>
            </AuthenticationGuard>
        </>

    );
}
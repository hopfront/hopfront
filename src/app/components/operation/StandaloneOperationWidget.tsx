import {StandaloneOperation} from "@/app/lib/model/StandaloneOperation";
import {ApiOperationWidget} from "@/app/components/operation/ApiOperationWidget";
import {useApiContext} from "@/app/hooks/useApiContext";
import Box from "@mui/joy/Box";
import LinearProgress from "@mui/joy/LinearProgress";
import {ErrorAlert} from "@/app/components/operation/response/ErrorAlert";
import {AuthenticationGuard} from "@/app/components/authentication/AuthenticationGuard";

export interface StandaloneOperationWidgetProps {
    operation: StandaloneOperation
}

export const StandaloneOperationWidget = ({operation}: StandaloneOperationWidgetProps) => {
    const {data: apiContext, error, isLoading} = useApiContext(operation.apiSpec.id);

    if (isLoading || !apiContext) {
        return <Box><LinearProgress/></Box>;
    }

    if (error) {
        return <ErrorAlert error={error} apiContext={apiContext}/>;
    }

    return (
        <AuthenticationGuard operationId={operation.getOperationId()} apiContext={apiContext}>
            <ApiOperationWidget operation={operation} apiContext={apiContext} shouldGetOperationAutoSubmit={false}/>
        </AuthenticationGuard>
    );
}
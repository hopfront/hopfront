import { ApiOperationWidget } from "@/app/components/operation/ApiOperationWidget";
import { ResponsiveModal } from "../modal/ResponsiveModal";
import { ResponseSchemaSelectedObserver } from "@/app/lib/model/ResponseSchemaSelectedObserver";
import { StandaloneOperation } from "@/app/lib/model/StandaloneOperation";
import { ApiContext } from "@/app/lib/model/ApiContext";
import { useApiContext } from "@/app/hooks/useApiContext";
import { LinearProgress } from "@mui/joy";

export interface ModalOperationResponseSchemaSelectorProps {
    open: boolean
    onCancel: (reason: string) => void
    operation: StandaloneOperation
    responseSchemaSelectedObserver: ResponseSchemaSelectedObserver
}

export const ModalOperationResponseSchemaSelector = ({
    open,
    onCancel,
    operation,
    responseSchemaSelectedObserver
}: ModalOperationResponseSchemaSelectorProps) => {

    const { data: apiContext, isLoading } = useApiContext(operation.apiSpec.id);

    return (
        <ResponsiveModal open={open} onClose={(_, reason) => {
            onCancel(reason)
        }}>
            {isLoading &&
                <LinearProgress />}
            {apiContext &&
                <ApiOperationWidget
                    operation={operation}
                    responseSchemaSelectedObserver={responseSchemaSelectedObserver}
                    apiContext={apiContext} />}
        </ResponsiveModal>
    );
}
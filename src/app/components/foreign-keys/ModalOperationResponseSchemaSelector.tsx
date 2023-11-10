import {ApiOperationWidget} from "@/app/components/operation/ApiOperationWidget";
import {ResponsiveModal} from "../modal/ResponsiveModal";
import {ResponseSchemaSelectedObserver} from "@/app/lib/model/ResponseSchemaSelectedObserver";
import {StandaloneOperation} from "@/app/lib/model/StandaloneOperation";
import {ApiContext} from "@/app/lib/model/ApiContext";

export interface ModalOperationResponseSchemaSelectorProps {
    open: boolean
    onCancel: (reason: string) => void
    operation: StandaloneOperation
    responseSchemaSelectedObserver: ResponseSchemaSelectedObserver
    apiContext: ApiContext
}

export const ModalOperationResponseSchemaSelector = ({
                                                         open,
                                                         onCancel,
                                                         operation,
                                                         responseSchemaSelectedObserver,
                                                         apiContext,
                                                     }: ModalOperationResponseSchemaSelectorProps) => {
    return (
        <ResponsiveModal open={open} onClose={(_, reason) => {
            onCancel(reason)
        }}>
            <ApiOperationWidget
                operation={operation}
                responseSchemaSelectedObserver={responseSchemaSelectedObserver}
                apiContext={apiContext}/>
        </ResponsiveModal>
    );
}
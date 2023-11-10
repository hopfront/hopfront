import {ApiContext, SchemaOrReference} from "@/app/lib/model/ApiContext";
import {getOperationButtonColor} from "@/app/lib/openapi/utils";
import {ModalObjectOperationExecutor} from "@/app/components/operation/ModalObjectOperationExecutor";
import {OperationIcon} from "@/app/components/operation/OperationIcon";
import {Button} from "@mui/joy";
import {useState} from "react";
import {StandaloneOperation} from "@/app/lib/model/StandaloneOperation";

export interface ButtonModalObjectOperationExecutorProps {
    operation: StandaloneOperation
    object: any
    objectSchema: SchemaOrReference
    disabled?: boolean
    onOperationExecuted?: () => void
    apiContext: ApiContext
}

export const ButtonModalObjectOperationExecutor = ({
                                                       object,
                                                       objectSchema,
                                                       disabled,
                                                       operation,
                                                       onOperationExecuted,
                                                       apiContext
                                                   }: ButtonModalObjectOperationExecutorProps) => {
    const [open, setOpen] = useState(false);

    return (
        <>
            <Button
                disabled={disabled}
                variant="outlined"
                color={getOperationButtonColor(operation)}
                startDecorator={<OperationIcon operation={operation}/>}
                onClick={() => setOpen(true)}>{operation.operation.summary}</Button>

            <ModalObjectOperationExecutor
                key={operation.getOperationId()}
                operation={operation}
                open={open}
                onCancel={() => setOpen(false)}
                object={object}
                objectSchema={objectSchema}
                onOperationExecuted={onOperationExecuted}
                apiContext={apiContext}/>
        </>
    );
}
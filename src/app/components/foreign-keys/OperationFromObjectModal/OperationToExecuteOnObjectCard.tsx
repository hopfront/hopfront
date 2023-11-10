import {StandaloneOperation} from "@/app/lib/model/StandaloneOperation";
import Typography from "@mui/joy/Typography";
import {SchemaRefLabel} from "@/app/settings/schemas/SchemaRefLabel";
import {MoreVert} from "@mui/icons-material";
import {ApiSpecSelect} from "@/app/components/select/ApiSpecSelect";
import {OperationSelect} from "@/app/components/select/OperationSelect";
import {WarningAlert} from "@/app/components/alert/WarningAlert";
import Card from "@mui/joy/Card";
import React, {useState} from "react";
import {ApiSpec} from "@/app/lib/dto/ApiSpec";
import {findRunnableOperationsFromSchema} from "@/app/lib/openapi/utils";
import {ApiContext} from "@/app/lib/model/ApiContext";

export interface OperationToExecuteOnObjectCardProps {
    schemaRef: string
    onOperationSelected: (operation: StandaloneOperation) => void
    disabled: boolean
    apiContext: ApiContext
}

export const OperationToExecuteOnObjectCard = ({schemaRef, onOperationSelected, disabled, apiContext}: OperationToExecuteOnObjectCardProps) => {
    const [apiSpec, setApiSpec] = useState<ApiSpec | undefined>(apiContext.apiSpec);
    const [operation, setOperation] = useState<StandaloneOperation | undefined>();

    const isOperationAlreadyRunnable = (operation: StandaloneOperation) => {
        const alreadyRunnableOperations = findRunnableOperationsFromSchema(schemaRef, apiContext)
        const alreadyRunnableOperation = alreadyRunnableOperations.find(op => op.operation.getOperationId() === operation?.getOperationId());
        return (!!alreadyRunnableOperation);
    }

    const alreadyRunnable = operation && isOperationAlreadyRunnable(operation);

    return (
        <Card sx={{mt: 2}}>
            <Typography level="title-md">
                2. Which operation do you want to execute from a
                {' '}<Typography level="title-sm" variant="outlined"><SchemaRefLabel
                schemaRef={schemaRef}/></Typography> object?
            </Typography>
            <Typography level="body-sm">
                <Typography>This operation will be available when an object of type {' "'}<SchemaRefLabel
                    schemaRef={schemaRef}/>{'" '} will be displayed in
                    HopFront.</Typography><br/>
                <Typography level="body-sm">For example, if the object is displayed within a table, you will be able
                    to call the operation via the menu (<Typography><MoreVert/></Typography>) of each
                    row.</Typography>
            </Typography>
            <ApiSpecSelect
                defaultApiSpecId={apiContext.apiSpec.id}
                onApiSpecSelected={spec => spec && setApiSpec(spec)}
                disabled={disabled}/>
            {apiSpec && <OperationSelect
                onOperationSelected={op => {
                    setOperation(op);

                    if (op && !isOperationAlreadyRunnable(op)) {
                        onOperationSelected(op);
                    }
                }}
                disabled={disabled}
                apiSpec={apiSpec}/>}
            {alreadyRunnable && <WarningAlert title={"This operation is already executable from this object"}/>}
        </Card>
    );
}
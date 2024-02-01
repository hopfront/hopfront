import {ResponsiveModal} from "@/app/components/modal/ResponsiveModal";
import Typography from "@mui/joy/Typography";
import {ApiContext, SchemaOrReference} from "@/app/lib/model/ApiContext";
import {AutoFixHigh} from "@mui/icons-material";
import React, {useState} from "react";
import {StandaloneOperation} from "@/app/lib/model/StandaloneOperation";

import {getReferenceObjectOrUndefined} from "@/app/lib/openapi/utils";
import {Button} from "@mui/joy";
import {ErrorAlert} from "@/app/components/operation/response/ErrorAlert";
import {ParameterExtension, SchemaExtension} from "@/app/lib/dto/OpenApiExtensions";
import {
    SelectedObjectSchemaCard
} from "@/app/components/foreign-keys/OperationFromObjectModal/SelectedObjectSchemaCard";
import {
    OperationToExecuteOnObjectCard
} from "@/app/components/foreign-keys/OperationFromObjectModal/OperationToExecuteOnObjectCard";
import {
    SchemaToOperationInputsMappingCard
} from "@/app/components/foreign-keys/OperationFromObjectModal/SchemaToOperationInputsMappingCard";
import {ExtensionApi} from "@/app/lib/api/ExtensionApi";
import {ButtonRow} from "@/app/components/button/ButtonRow";
import {EventType, useSnackbar} from "@/app/hooks/useSnackbar";

export interface OperationFromObjectModalProps {
    open: boolean
    onClose: () => void
    sampleObject: any | undefined
    objectSchema: SchemaOrReference
    onConfigurationUpdate: () => void
    apiContext: ApiContext
}

export const OperationFromObjectModal = ({
                                             open,
                                             onClose,
                                             sampleObject,
                                             objectSchema,
                                             onConfigurationUpdate,
                                             apiContext
                                         }: OperationFromObjectModalProps) => {
    const [operation, setOperation] = useState<StandaloneOperation | undefined>();

    const objectSchemaReferenceObject = getReferenceObjectOrUndefined(objectSchema)!;

    const [submitting, setSubmitting] = useState(false);
    const [parameterExtensions, setParameterExtensions] = useState<ParameterExtension[]>([]);
    const [schemaExtensions, setSchemaExtensions] = useState<SchemaExtension[]>([]);
    const [error, setError] = useState<any | undefined>();
    const {showSnackbar, Snackbar} = useSnackbar();

    const saveOperationExtensions = async (operation: StandaloneOperation) => {
        return Promise.all(parameterExtensions.flatMap(parameterExtension => {
            return parameterExtension.foreignKeys.flatMap(foreignKey => {
                return ExtensionApi.saveOperationParameterForeignKey(
                    operation.apiSpec.id,
                    operation.getOperationId(),
                    parameterExtension.parameterName,
                    foreignKey);
            });
        }));
    }

    const saveSchemaExtensions = async (operation: StandaloneOperation) => {
        return Promise.all(schemaExtensions.flatMap(schemaExtension => {
            return schemaExtension.properties.flatMap(schemaPropertyExtension => {
                return schemaPropertyExtension.foreignKeys.map(foreignKey => {
                    return ExtensionApi.saveSchemaPropertyForeignKey(
                        operation.apiSpec.id,
                        schemaExtension.schemaRef,
                        schemaPropertyExtension.propertyName,
                        foreignKey)
                });
            });
        }));
    }

    const onSubmit = () => {
        if (!operation) {
            return;
        }

        setError(undefined);
        setSubmitting(true);

        return Promise.all([
            saveOperationExtensions(operation),
            saveSchemaExtensions(operation)
        ]).then(() => {
            setError(undefined);
            setSubmitting(false);
            showSnackbar(EventType.Success, 'Configuration updated successfully');
            onConfigurationUpdate();
        }).catch(reason => {
            setError(reason);
            setSubmitting(false);
            showSnackbar(EventType.Error, `Failed to update configuration: ${reason.toLocaleString()}`);
        })
    };

    return (
        <ResponsiveModal open={open} onClose={onClose}>
            <Typography level="h1">
                <Typography><AutoFixHigh/></Typography> Smart Operation configuration</Typography>
            <SelectedObjectSchemaCard schemaRef={objectSchemaReferenceObject.$ref}/>
            <OperationToExecuteOnObjectCard
                schemaRef={objectSchemaReferenceObject.$ref}
                onOperationSelected={operation => setOperation(operation)}
                disabled={submitting}
                apiContext={apiContext}/>
            {operation && <SchemaToOperationInputsMappingCard
                sampleObject={sampleObject}
                objectSchema={objectSchema}
                schemaRef={objectSchemaReferenceObject.$ref}
                operation={operation}
                onParameterExtensionsSelected={selectedParameterExtensions => setParameterExtensions(selectedParameterExtensions)}
                onSchemaExtensionSelected={selectedSchemaExtensions => setSchemaExtensions(selectedSchemaExtensions)}
                disabled={submitting}
                apiContext={apiContext}/>}
            <ButtonRow align="right" sx={{mt: 2}}>
                <Button
                    disabled={parameterExtensions.length === 0 && schemaExtensions.length === 0}
                    loading={submitting}
                    onClick={onSubmit}>
                    Submit
                </Button>
                <Button
                    disabled={submitting}
                    variant="outlined"
                    onClick={onClose}>
                    Cancel
                </Button>
            </ButtonRow>
            <ErrorAlert error={error}/>

            {Snackbar}
        </ResponsiveModal>
    );
}
import React, {useState} from "react";
import {OperationSelect} from "@/app/components/select/OperationSelect";
import {OperationExtensionConfigurer} from "@/app/settings/operations/OperationExtensionConfigurer";
import {OperationExtension} from "@/app/lib/dto/OpenApiExtensions";
import {ApiContext} from "@/app/lib/model/ApiContext";
import {ExtensionApi} from "@/app/lib/api/ExtensionApi";
import {EventType, useSnackbar} from "@/app/hooks/useSnackbar";

export interface OperationsExtensionsConfigurerPageProps {
    apiContext: ApiContext
    readOnly: boolean
}

export const OperationsExtensionsConfigurerPage = ({apiContext, readOnly}: OperationsExtensionsConfigurerPageProps) => {
    const [operationExtension, setOperationExtension] = useState<OperationExtension | undefined>();
    const {showSnackbar, Snackbar} = useSnackbar();

    const onOperationExtensionChange = (updatedOperationExtension: OperationExtension) => {
        // The "object copy" trick is used to force the component to re-render.
        setOperationExtension({...updatedOperationExtension});

        ExtensionApi.saveOperationExtension(apiContext.apiSpec.id, updatedOperationExtension)
            .then(() => showSnackbar(EventType.Success, 'Schema configuration updated successfully'))
            .catch(reason => showSnackbar(EventType.Error, `Failed to update schema configuration: ${reason.toLocaleString()}`));
    };

    return (
        <>
            <OperationSelect
                onOperationSelected={operation => {
                    const selectedOperationExtension = (apiContext.extension?.operations || [])
                        .find(op => op.operationId === operation?.getOperationId());

                    setOperationExtension(selectedOperationExtension);
                }}
                apiSpec={apiContext.apiSpec}
                sx={{mb: 2}}/>

            {(operationExtension) && <OperationExtensionConfigurer
                operationExtension={operationExtension}
                onOperationExtensionChange={onOperationExtensionChange}
                readOnly={readOnly}
                apiContext={apiContext}
            />}

            {Snackbar}
        </>
    );
}
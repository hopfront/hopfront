import React, {useState} from "react";
import {OperationSelect} from "@/app/components/select/OperationSelect";
import {OperationExtensionConfigurer} from "@/app/settings/operations/OperationExtensionConfigurer";
import {OperationExtension} from "@/app/lib/dto/OpenApiExtensions";
import {ApiContext} from "@/app/lib/model/ApiContext";
import {ExtensionApi} from "@/app/lib/api/ExtensionApi";

export interface OperationsExtensionsConfigurerPageProps {
    apiContext: ApiContext
    readOnly: boolean
}

export const OperationsExtensionsConfigurerPage = ({apiContext, readOnly}: OperationsExtensionsConfigurerPageProps) => {
    const [operationExtension, setOperationExtension] = useState<OperationExtension | undefined>();

    const onOperationExtensionChange = (updatedOperationExtension: OperationExtension) => {
        // The "object copy" trick is used to force the component to re-render.
        setOperationExtension({...updatedOperationExtension});

        ExtensionApi.saveOperationExtension(apiContext.apiSpec.id, updatedOperationExtension)
            .then(response => console.log(`Saved extension for api spec with id=${apiContext.apiSpec.id}`))
            .catch(reason => console.log(`Failed to save extension for api spec with id=${apiContext.apiSpec.id}`, reason));
    };

    return (
        <>
            <OperationSelect
                onOperationSelected={operation => {
                    const selectedOperationExtension = apiContext.extension.operations
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
        </>
    );
}
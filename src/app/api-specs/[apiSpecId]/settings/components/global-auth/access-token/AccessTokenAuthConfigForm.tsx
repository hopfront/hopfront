import { OperationSelect } from "@/app/components/select/OperationSelect";
import { ApiAuthenticationAccessTokenData, ApiAuthenticationConfig } from "@/app/lib/dto/ApiAuthenticationConfig";
import { ApiSpec } from "@/app/lib/dto/ApiSpec";
import { UpdatableValue } from "@/app/lib/model/UpdatableValue";
import {
    getSchemaPropertyType
} from "@/app/lib/openapi/utils";
import FormControl from "@mui/joy/FormControl";
import FormHelperText from "@mui/joy/FormHelperText";
import { useEffect, useMemo, useState } from "react";
import {
    ResponseSchemaProperty,
    ResponseSchemaPropertySelector
} from "@/app/components/input/ResponseSchemaPropertySelector";
import { ApiSpecSelect } from "@/app/components/select/ApiSpecSelect";
import { StandaloneOperation } from "@/app/lib/model/StandaloneOperation";

type FormData = {
    apiSpecId?: string
    operationId?: string,
    responseStatus?: string
    responseContentType?: string
    responseSchemaRef?: string
    responseAccessTokenPropertyName?: string,
}

export interface AccessTokenAuthenticationFormProps {
    auth: UpdatableValue<ApiAuthenticationConfig>
    disabled: boolean
    apiSpec: ApiSpec
}

export default function AccessTokenAuthConfigForm({ auth, apiSpec }: AccessTokenAuthenticationFormProps) {
    const accessTokenData = auth.value?.data as ApiAuthenticationAccessTokenData | undefined

    const initialValues = useMemo(() => {
        return {
            apiSpecId: accessTokenData?.apiSpecId ?? apiSpec.id,
            operationId: accessTokenData?.operationId,
            responseStatus: accessTokenData?.responseStatus,
            responseContentType: accessTokenData?.responseContentType,
            responseSchemaRef: accessTokenData?.responseSchemaRef,
            responseAccessTokenPropertyName: accessTokenData?.responseAccessTokenPropertyName,
        } as FormData
    }, [accessTokenData?.apiSpecId, accessTokenData?.operationId, accessTokenData?.responseAccessTokenPropertyName, accessTokenData?.responseContentType, accessTokenData?.responseSchemaRef, accessTokenData?.responseStatus, apiSpec.id]);

    const [formData, setFormData] = useState<FormData>(initialValues);
    const [selectedApiSpec, setSelectedApiSpec] = useState<ApiSpec | undefined>(undefined);
    const [selectedOperation, setSelectedOperation] = useState<StandaloneOperation | undefined>(undefined);

    useEffect(() => {
        auth.onValueUpdate({
            authenticationType: "ACCESS_TOKEN",
            data: {
                apiSpecId: formData.apiSpecId,
                operationId: formData.operationId,
                responseStatus: formData.responseStatus,
                responseContentType: formData.responseContentType,
                responseSchemaRef: formData.responseSchemaRef,
                responseAccessTokenPropertyName: formData.responseAccessTokenPropertyName,
            } as ApiAuthenticationAccessTokenData,
        } as ApiAuthenticationConfig);
    }, [formData, auth])

    const formControlCommonSx = { mb: 1.5 };

    return (
        <>
            <FormControl sx={{ ...formControlCommonSx, mt: 1 }}>
                <ApiSpecSelect
                    defaultApiSpecId={formData.apiSpecId}
                    onComponentLoaded={apiSpec => setSelectedApiSpec(apiSpec)}
                    onApiSpecSelected={selectedApiSpec => {
                        setSelectedOperation(undefined);
                        setSelectedApiSpec(selectedApiSpec);

                        if (selectedApiSpec) {
                            setFormData({
                                apiSpecId: selectedApiSpec.id,
                                operationId: undefined,
                                responseStatus: undefined,
                                responseContentType: undefined,
                                responseSchemaRef: undefined,
                                responseAccessTokenPropertyName: undefined,
                            });
                        }
                    }} />
                <FormHelperText>
                    {`The API used as an authentication source for "${apiSpec.document.info.title || 'Untitled API'}."`}
                </FormHelperText>
            </FormControl>
            {selectedApiSpec &&
                <FormControl sx={formControlCommonSx}>
                    <OperationSelect
                        defaultOperationId={formData.operationId}
                        onComponentLoaded={operation => setSelectedOperation(operation)}
                        onOperationSelected={selectedOperation => {
                            if (selectedOperation && selectedOperation.getOperationId()) {
                                setFormData({
                                    apiSpecId: selectedApiSpec.id,
                                    operationId: selectedOperation.getOperationId(),
                                    responseStatus: undefined,
                                    responseContentType: undefined,
                                    responseSchemaRef: undefined,
                                    responseAccessTokenPropertyName: undefined,
                                });
                            }
                        }}
                        apiSpec={selectedApiSpec}
                    />
                    <FormHelperText>
                        The operation that is going to get prompted to users who need to authenticate.
                    </FormHelperText>
                </FormControl>}
            {selectedApiSpec && selectedOperation &&
                <ResponseSchemaPropertySelector
                    defaultSchemaProperty={(formData.responseSchemaRef && formData.responseAccessTokenPropertyName)
                        ? {
                            status: formData.responseStatus,
                            contentType: formData.responseContentType,
                            schemaRef: formData.responseSchemaRef,
                            propertyName: formData.responseAccessTokenPropertyName
                        } as ResponseSchemaProperty
                        : undefined}
                    schemaPropertyPredicate={schemaProperty => {
                        const schemaPropertyType = getSchemaPropertyType(schemaProperty, selectedApiSpec);
                        return schemaPropertyType === "string";
                    }}
                    onResponseSchemaPropertySelected={schemaProperty => {
                        setFormData({
                            apiSpecId: selectedApiSpec.id,
                            operationId: selectedOperation.getOperationId(),
                            responseStatus: schemaProperty.status,
                            responseContentType: schemaProperty.contentType,
                            responseSchemaRef: schemaProperty.schemaRef,
                            responseAccessTokenPropertyName: schemaProperty.propertyName,
                        })
                    }}
                    operation={selectedOperation} />}
        </>
    )
};
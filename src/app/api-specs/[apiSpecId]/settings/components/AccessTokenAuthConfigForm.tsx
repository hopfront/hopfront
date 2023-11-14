import {ApiAuthenticationAccessTokenData, ApiAuthenticationConfig} from "@/app/lib/dto/ApiAuthenticationConfig";
import {UpdatableValue} from "@/app/lib/model/UpdatableValue";
import FormControl from "@mui/joy/FormControl";
import FormHelperText from "@mui/joy/FormHelperText";
import {useEffect, useMemo, useState} from "react";
import {OperationSelect} from "@/app/components/select/OperationSelect";
import {ApiSpec} from "@/app/lib/dto/ApiSpec";
import {
    getSchemaPropertyType,
    getStandaloneOperation
} from "@/app/lib/openapi/utils";

import * as React from "react";
import {ApiSpecSelect} from "@/app/components/select/ApiSpecSelect";
import {
    ResponseSchemaProperty,
    ResponseSchemaPropertySelector
} from "@/app/components/input/ResponseSchemaPropertySelector";

import {SchemaProperty} from "@/app/components/foreign-keys/SchemaPropertyPicker/SchemaPropertyPicker";

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

export default function AccessTokenAuthConfigForm({auth, disabled, apiSpec}: AccessTokenAuthenticationFormProps) {
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

    const operation = formData.operationId ? getStandaloneOperation(formData.operationId, apiSpec) : undefined;

    const formControlCommonSx = {mb: 1.5};

    return (
        <>
            <FormControl sx={{...formControlCommonSx, mt: 1}}>
                <ApiSpecSelect
                    defaultApiSpecId={formData.apiSpecId}
                    disabled={disabled}
                    onApiSpecSelected={selectedApiSpec => {
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
                    }}/>
                <FormHelperText>
                    {`The API used as an authentication source for "${apiSpec.document.info.title}."`}
                </FormHelperText>
            </FormControl>
            <FormControl sx={formControlCommonSx}>
                <OperationSelect
                    defaultOperationId={formData.operationId}
                    disabled={disabled}
                    onOperationSelected={selectedOperation => {
                        if (selectedOperation && selectedOperation.getOperationId()) {
                            setFormData({
                                apiSpecId: formData.apiSpecId,
                                operationId: selectedOperation.getOperationId(),
                                responseStatus: undefined,
                                responseContentType: undefined,
                                responseSchemaRef: undefined,
                                responseAccessTokenPropertyName: undefined,
                            });
                        }
                    }}
                    apiSpec={apiSpec}
                />
                <FormHelperText>
                    The operation that is going to get prompted to users who need to authenticate.
                </FormHelperText>
            </FormControl>
            {(apiSpec && operation) && <ResponseSchemaPropertySelector
                defaultSchemaProperty={(formData.responseSchemaRef && formData.responseAccessTokenPropertyName)
                    ? {
                        status: formData.responseStatus,
                        contentType: formData.responseContentType,
                        schemaRef: formData.responseSchemaRef,
                        propertyName: formData.responseAccessTokenPropertyName
                    } as ResponseSchemaProperty
                    : undefined}
                schemaPropertyPredicate={schemaProperty => {
                    const schemaPropertyType = getSchemaPropertyType(schemaProperty, apiSpec);
                    return schemaPropertyType === "string";
                }}
                onResponseSchemaPropertySelected={schemaProperty => {
                    setFormData({
                        apiSpecId: formData.apiSpecId,
                        operationId: formData.operationId,
                        responseStatus: schemaProperty.status,
                        responseContentType: schemaProperty.contentType,
                        responseSchemaRef: schemaProperty.schemaRef,
                        responseAccessTokenPropertyName: schemaProperty.propertyName,
                    })
                }}
                disabled={disabled}
                operation={operation}/>}
        </>
    )
};
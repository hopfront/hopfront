export interface ApiAuthenticationAccessTokenConfigData {
    apiSpecId: string
    operationId: string
    responseStatus: string
    responseContentType: string
    responseSchemaRef: string
    responseAccessTokenPropertyName: string
}

export type StaticParamLocation = 'HEADER' | 'QUERY';

export interface ApiAuthenticationStaticParameterConfigData {
    parameterName: string,
    parameterLocation: StaticParamLocation,
}

export interface ApiAuthenticationConfig {
    authenticationType: AuthenticationType,
    data?: ApiAuthenticationAccessTokenConfigData | ApiAuthenticationStaticParameterConfigData,
}

export type AuthenticationType = 'ACCESS_TOKEN' | 'NONE';
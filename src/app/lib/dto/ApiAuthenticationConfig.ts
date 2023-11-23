export interface ApiAuthenticationAccessTokenData {
    apiSpecId: string
    operationId: string
    responseStatus: string
    responseContentType: string
    responseSchemaRef: string
    responseAccessTokenPropertyName: string
}

export type StaticParamLocation = 'HEADER' | 'QUERY';

export interface ApiAuthenticationStaticParameterData {
    parameterName: string,
    parameterLocation: StaticParamLocation,
}

export interface ApiAuthenticationConfig {
    authenticationType: AuthenticationType,
    data?: ApiAuthenticationAccessTokenData | ApiAuthenticationStaticParameterData,
}

export type AuthenticationType = 'STATIC' | 'BASIC_AUTH' | 'ACCESS_TOKEN' | 'NONE';
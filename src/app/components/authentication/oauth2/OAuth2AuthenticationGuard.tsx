import {AuthProvider, TRefreshTokenExpiredEvent} from "react-oauth2-code-pkce";
import React from "react";
import {ApiContext} from "@/app/lib/model/ApiContext";
import {ApiAuthenticationOAuth2Data} from "@/app/lib/dto/ApiAuthenticationConfig";
import {Box} from "@mui/joy";
import LinearProgress from "@mui/joy/LinearProgress";
import {ErrorAlert} from "@/app/components/operation/response/ErrorAlert";
import {useInstanceProperties} from "@/app/hooks/useInstanceProperties";

export const buildOauthProviderLocalStorageKeyPrefix = (oauthProviderId: string) => {
    return `com.hopfront.oauth-provider.${oauthProviderId}.`
}

export interface OAuth2AuthenticationGuardProps {
    apiContext: ApiContext
    postLogin: () => void
    children: React.ReactNode
}

export const OAuth2AuthenticationGuard = ({apiContext, postLogin, children}: OAuth2AuthenticationGuardProps) => {
    const { data: properties, isLoading: isPropertiesLoading, error: propertiesError } = useInstanceProperties();

    if (isPropertiesLoading) {
        return <Box><LinearProgress/></Box>;
    }

    if (propertiesError) {
        return <ErrorAlert error={propertiesError}/>;
    }

    if (apiContext.config.authenticationConfig?.authenticationType === "OAUTH2") {
        const data = apiContext.config.authenticationConfig.data as ApiAuthenticationOAuth2Data;

        const oauthProvider = (properties?.oauthProviders || []).find(op => op.id === data.oauthProviderId);

        if (!oauthProvider) {
            return <ErrorAlert error={new Error(`Could not find OAuth provider with id=${data.oauthProviderId}`)}/>;
        }

        return (
            <AuthProvider authConfig={{
                clientId: oauthProvider.clientId,
                authorizationEndpoint: oauthProvider.authorizationEndpoint,
                tokenEndpoint: oauthProvider.tokenEndpoint,
                scope: oauthProvider.scope,
                redirectUri: window.location.href,
                storage: 'local',
                storageKeyPrefix: buildOauthProviderLocalStorageKeyPrefix(oauthProvider.id),
                postLogin: postLogin,
                onRefreshTokenExpire: (event: TRefreshTokenExpiredEvent) => window.confirm('Session expired. Refresh page to continue using the site?') && event.login(),
            }}>
                {children}
            </AuthProvider>
        );

    } else {
        return children;
    }
}
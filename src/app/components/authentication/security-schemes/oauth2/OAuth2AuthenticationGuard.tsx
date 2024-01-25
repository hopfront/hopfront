import {AuthProvider, TRefreshTokenExpiredEvent} from "react-oauth2-code-pkce";
import React from "react";
import {OpenAPIV3} from "openapi-types";
import OAuth2SecurityScheme = OpenAPIV3.OAuth2SecurityScheme;
import {SecurityScheme} from "@/app/lib/model/SecurityScheme";
import {useInstanceProperties} from "@/app/hooks/useInstanceProperties";
import LinearProgress from "@mui/joy/LinearProgress";
import {Box} from "@mui/joy";
import {ErrorAlert} from "@/app/components/operation/response/ErrorAlert";

export const buildSecuritySchemeLocalStorageKeyPrefix = (oauthProviderId: string) => {
    return `com.hopfront.oauth-provider.${oauthProviderId}.`
}

export interface OAuth2AuthenticationGuardProps {
    securityScheme: SecurityScheme
    postLogin: () => void
    children: React.ReactNode
}

export const OAuth2AuthenticationGuard = ({securityScheme, postLogin, children}: OAuth2AuthenticationGuardProps) => {
    const {data: properties, isLoading: propertiesLoading, error: propertiesError} = useInstanceProperties();

    const oauth2SecurityScheme = securityScheme.object as OAuth2SecurityScheme;

    const authorizationCodeFlow = oauth2SecurityScheme.flows.authorizationCode;

    if (!authorizationCodeFlow) {
        // We only handle authorization code flow yet.
        return children;
    }

    if (propertiesLoading || !properties) {
        return <Box><LinearProgress/></Box>;
    }

    if (propertiesError) {
        return <ErrorAlert error={propertiesError}/>;
    }

    return (
        <AuthProvider authConfig={{
            clientId: `hopfront-${properties.instanceId}`,
            authorizationEndpoint: authorizationCodeFlow.authorizationUrl,
            tokenEndpoint: authorizationCodeFlow.tokenUrl,
            redirectUri: window.location.href,
            scope: Object.keys(authorizationCodeFlow.scopes).join(' '),
            storage: 'local',
            storageKeyPrefix: buildSecuritySchemeLocalStorageKeyPrefix(securityScheme.key),
            postLogin: postLogin,
            onRefreshTokenExpire: (event: TRefreshTokenExpiredEvent) => window.confirm('Session expired. Refresh page to continue using the site?') && event.login(),
        }}>
            {children}
        </AuthProvider>
    );
}
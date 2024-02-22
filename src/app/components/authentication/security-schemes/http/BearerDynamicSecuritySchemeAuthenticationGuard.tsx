import {AuthService} from "@/app/lib/service/AuthService";
import {
    AccessTokenAuthenticationModal
} from "@/app/components/authentication/access-token/AccessTokenAuthenticationModal";
import {AuthLocalStorage} from "@/app/lib/localstorage/AuthLocalStorage";
import React from "react";
import {ApiContext} from "@/app/lib/model/ApiContext";
import {ApiAuthenticationAccessTokenConfigData} from "@/app/lib/dto/ApiAuthenticationConfig";

export interface BearerDynamicSecuritySchemeAuthenticationGuardProps {
    accessTokenConfig: ApiAuthenticationAccessTokenConfigData
    apiContext: ApiContext
    onAuthenticationHandled: () => void,
    onAuthenticationIgnored: () => void
    children: React.ReactNode
}

export const BearerDynamicSecuritySchemeAuthenticationGuard = ({accessTokenConfig, apiContext, onAuthenticationHandled, onAuthenticationIgnored, children}: BearerDynamicSecuritySchemeAuthenticationGuardProps) => {
    const apiAuthenticationStatus = AuthService.getHttpBearerAuthenticationStatus(apiContext);

    if (apiAuthenticationStatus.isAuthenticationRequired && !apiAuthenticationStatus.isAuthenticated) {
        return <AccessTokenAuthenticationModal
            open={true}
            onClose={onAuthenticationIgnored}
            accessTokenConfig={accessTokenConfig}
            onAccessToken={newAccessToken => {
                AuthLocalStorage.setBearerAuthCredentials(apiContext, {
                    bearer: newAccessToken
                });
                onAuthenticationHandled();
            }}
            apiContext={apiContext}/>
    } else {
        return children;
    }
}
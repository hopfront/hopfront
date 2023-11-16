import {AccessTokenAuthenticationModal} from "@/app/components/authentication/access-token/AccessTokenAuthenticationModal";
import React from "react";
import {ApiContext} from "@/app/lib/model/ApiContext";
import {AuthLocalStorage} from "@/app/lib/localstorage/AuthLocalStorage";
import {AuthService} from "@/app/lib/service/AuthService";

export interface AccessTokenAuthenticationGuard {
    apiContext: ApiContext,
    onAuthenticationHandled: () => void,
    onAuthenticationIgnored: () => void
    children: React.ReactNode;
}

export const AccessTokenAuthenticationGuard = ({apiContext, onAuthenticationHandled, onAuthenticationIgnored, children}: AccessTokenAuthenticationGuard) => {
    const apiAuthenticationStatus = AuthService.getAccessTokenAuthenticationStatus(apiContext);

    if (apiContext.config.authenticationConfig?.authenticationType === "ACCESS_TOKEN" && apiAuthenticationStatus.isAuthenticationRequired && !apiAuthenticationStatus.isAuthenticated) {
        return <AccessTokenAuthenticationModal
            open={true}
            onClose={onAuthenticationIgnored}
            onAccessToken={newAccessToken => {
                AuthLocalStorage.setAccessToken(apiContext, newAccessToken);
                onAuthenticationHandled();
            }}
            apiContext={apiContext}/>;
    } else {
        return children;
    }
}
import React from "react";
import {AuthLocalStorage} from "@/app/lib/localstorage/AuthLocalStorage";
import {ApiContext} from "@/app/lib/model/ApiContext";
import {
    BearerStaticSecuritySchemeAuthenticationGuard
} from "@/app/components/authentication/security-schemes/http/BearerStaticSecuritySchemeAuthenticationGuard";
import {
    AccessTokenAuthenticationModal
} from "@/app/components/authentication/access-token/AccessTokenAuthenticationModal";
import {AuthService} from "@/app/lib/service/AuthService";

export interface BearerSecuritySchemeAuthenticationGuardProps {
    securitySchemeKey: string
    apiContext: ApiContext
    onAuthenticationHandled: () => void,
    onAuthenticationIgnored: () => void
    children: React.ReactNode
}

export const BearerSecuritySchemeAuthenticationGuard = ({
                                                            securitySchemeKey,
                                                            apiContext,
                                                            onAuthenticationHandled,
                                                            onAuthenticationIgnored,
                                                            children
                                                        }: BearerSecuritySchemeAuthenticationGuardProps) => {

    const securitySchemeExtension = (apiContext.extension?.securitySchemes || []).find(sc => sc.securitySchemeKey === securitySchemeKey);

    if (securitySchemeExtension?.httpBearerExtension?.accessTokenConfig) {
        const apiAuthenticationStatus = AuthService.getAccessTokenAuthenticationStatus(apiContext);

        if (apiAuthenticationStatus.isAuthenticationRequired && !apiAuthenticationStatus.isAuthenticated) {
            return <AccessTokenAuthenticationModal
                open={true}
                onClose={onAuthenticationIgnored}
                accessTokenConfig={securitySchemeExtension?.httpBearerExtension?.accessTokenConfig}
                onAccessToken={newAccessToken => {
                    AuthLocalStorage.setAccessToken(apiContext, newAccessToken);
                    onAuthenticationHandled();
                }}
                apiContext={apiContext}/>
        } else {
            return children;
        }
    } else {
        return <BearerStaticSecuritySchemeAuthenticationGuard
            apiContext={apiContext}
            onAuthenticationHandled={onAuthenticationHandled}
            onAuthenticationIgnored={onAuthenticationIgnored}>
            {children}
        </BearerStaticSecuritySchemeAuthenticationGuard>
    }
}
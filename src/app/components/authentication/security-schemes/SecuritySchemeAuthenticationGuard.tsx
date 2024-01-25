import {OpenAPIV3} from "openapi-types";

import React from "react";
import {
    OAuth2AuthenticationGuard
} from "@/app/components/authentication/security-schemes/oauth2/OAuth2AuthenticationGuard";
import {SecurityScheme} from "@/app/lib/model/SecurityScheme";
import {
    HttpSecuritySchemeAuthenticationGuard
} from "@/app/components/authentication/security-schemes/http/HttpSecuritySchemeAuthenticationGuard";
import {ApiContext} from "@/app/lib/model/ApiContext";
import HttpSecurityScheme = OpenAPIV3.HttpSecurityScheme;
import {
    ApiKeySecuritySchemeAuthenticationGuard
} from "@/app/components/authentication/security-schemes/api-key/ApiKeySecuritySchemeAuthenticationGuard";

export interface SecurityRequirementsAuthenticationGuardProps {
    apiContext: ApiContext
    securityScheme: SecurityScheme
    onAuthenticationHandled: () => void,
    onAuthenticationIgnored: () => void,
    children: React.ReactNode
}

export const SecuritySchemeAuthenticationGuard = ({
                                                      apiContext,
                                                      securityScheme,
                                                      onAuthenticationHandled,
                                                      onAuthenticationIgnored,
                                                      children
                                                  }: SecurityRequirementsAuthenticationGuardProps) => {

    switch (securityScheme.object.type) {
        case "oauth2":
            return <OAuth2AuthenticationGuard
                securityScheme={securityScheme}
                postLogin={onAuthenticationHandled}>
                {children}
            </OAuth2AuthenticationGuard>;
        case "http":
            const httpSecurityScheme =
                securityScheme as unknown as HttpSecurityScheme;

            return <HttpSecuritySchemeAuthenticationGuard
                apiContext={apiContext}
                securityScheme={httpSecurityScheme}
                onAuthenticationHandled={onAuthenticationHandled}
                onAuthenticationIgnored={onAuthenticationIgnored}>
                {children}
            </HttpSecuritySchemeAuthenticationGuard>;
        case "apiKey":
            return <ApiKeySecuritySchemeAuthenticationGuard
                apiContext={apiContext}
                onAuthenticationHandled={onAuthenticationHandled}
                onAuthenticationIgnored={onAuthenticationIgnored}>
                {children}
            </ApiKeySecuritySchemeAuthenticationGuard>;
        default:
            return children;
    }
}
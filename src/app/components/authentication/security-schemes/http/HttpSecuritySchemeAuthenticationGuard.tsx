import React from "react";
import {OpenAPIV3} from "openapi-types";
import HttpSecurityScheme = OpenAPIV3.HttpSecurityScheme;
import {
    BasicAuthSecuritySchemeAuthenticationGuard
} from "@/app/components/authentication/security-schemes/http/BasicAuthSecuritySchemeAuthenticationGuard";
import {ApiContext} from "@/app/lib/model/ApiContext";
import {
    BearerSecuritySchemeAuthenticationGuard
} from "@/app/components/authentication/security-schemes/http/BearerSecuritySchemeAuthenticationGuard";

export interface HttpSecuritySchemeAuthenticationGuardProps {
    apiContext: ApiContext
    securityScheme: HttpSecurityScheme
    onAuthenticationHandled: () => void
    onAuthenticationIgnored: () => void
    children: React.ReactNode
}

export const HttpSecuritySchemeAuthenticationGuard = ({
                                                          apiContext,
                                                          securityScheme,
                                                          onAuthenticationHandled,
                                                          onAuthenticationIgnored,
                                                          children
                                                      }: HttpSecuritySchemeAuthenticationGuardProps) => {
    if (securityScheme.scheme === "basic") {
        return <BasicAuthSecuritySchemeAuthenticationGuard
            apiContext={apiContext}
            onAuthenticationHandled={onAuthenticationHandled}
            onAuthenticationIgnored={onAuthenticationIgnored}>
            {children}
        </BasicAuthSecuritySchemeAuthenticationGuard>;
    } else if (securityScheme.scheme === "bearer") {
        return <BearerSecuritySchemeAuthenticationGuard
            apiContext={apiContext}
            onAuthenticationHandled={onAuthenticationHandled}
            onAuthenticationIgnored={onAuthenticationIgnored}>
            {children}
        </BearerSecuritySchemeAuthenticationGuard>;
    } else {
        return children;
    }
}
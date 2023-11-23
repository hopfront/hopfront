import {OpenAPIV3} from "openapi-types";

import SecuritySchemeObject = OpenAPIV3.SecuritySchemeObject;
import React from "react";
import {OAuth2AuthenticationGuard} from "@/app/components/authentication/oauth2/OAuth2AuthenticationGuard";
import {SecurityScheme} from "@/app/lib/model/SecurityScheme";

export interface SecurityRequirementsAuthenticationGuardProps {
    securityScheme: SecurityScheme
    onAuthenticationHandled: () => void,
    onAuthenticationIgnored: () => void,
    children: React.ReactNode
}

export const SecuritySchemeAuthenticationGuard = ({
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
        default:
            return children;
    }
}
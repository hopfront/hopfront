import React from "react";
import {ApiContext} from "@/app/lib/model/ApiContext";
import {
    BearerStaticSecuritySchemeAuthenticationGuard
} from "@/app/components/authentication/security-schemes/http/BearerStaticSecuritySchemeAuthenticationGuard";
import {
    BearerDynamicSecuritySchemeAuthenticationGuard
} from "@/app/components/authentication/security-schemes/http/BearerDynamicSecuritySchemeAuthenticationGuard";

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
        return <BearerDynamicSecuritySchemeAuthenticationGuard
            accessTokenConfig={securitySchemeExtension?.httpBearerExtension?.accessTokenConfig}
            apiContext={apiContext}
            onAuthenticationHandled={onAuthenticationHandled}
            onAuthenticationIgnored={onAuthenticationIgnored}>
            {children}
        </BearerDynamicSecuritySchemeAuthenticationGuard>;
    } else {
        return <BearerStaticSecuritySchemeAuthenticationGuard
            apiContext={apiContext}
            onAuthenticationHandled={onAuthenticationHandled}
            onAuthenticationIgnored={onAuthenticationIgnored}>
            {children}
        </BearerStaticSecuritySchemeAuthenticationGuard>
    }
}
import { ApiContext } from "@/app/lib/model/ApiContext";
import { AccessTokenAuthenticationGuard } from "@/app/components/authentication/access-token/AccessTokenAuthenticationGuard";
import React, { useState } from "react";
import BasicAuthAuthenticationGuard from "@/app/components/authentication/basic-auth/BasicAuthAuthenticationGuard";
import StaticAuthenticationGuard from "@/app/components/authentication/static/StaticAuthenticationGuard";

export interface AuthenticationGuardProps {
    apiContext: ApiContext,
    children?: React.ReactNode;
}

export const AuthenticationGuard = ({
    apiContext,
    children
}: AuthenticationGuardProps) => {
    const authenticationConfig = apiContext.config.authenticationConfig;
    const [handled, setHandled] = useState(false);
    const [ignored, setIgnored] = useState(false);

    const onHandled = () => {
        setHandled(true);
        setIgnored(false);
    }

    const onIgnored = () => {
        setHandled(false);
        setIgnored(true);
    }

    if (handled || ignored) {
        return children;
    }

    if (authenticationConfig?.authenticationType === "ACCESS_TOKEN") {
        return <AccessTokenAuthenticationGuard
            apiContext={apiContext}
            onAuthenticationHandled={() => {
                onHandled();
            }}
            onAuthenticationIgnored={() => {
                onIgnored();
            }}>
            {children}
        </AccessTokenAuthenticationGuard>;
    } else if (authenticationConfig?.authenticationType === "STATIC") {
        return <StaticAuthenticationGuard
            apiContext={apiContext}
            onAuthenticationHandled={() => {
                onHandled();
            }}
            onAuthenticationIgnored={() => {
                onIgnored();
            }}>
            {children}
        </StaticAuthenticationGuard>;
    } else if (authenticationConfig?.authenticationType === "BASIC_AUTH") {
        return <BasicAuthAuthenticationGuard
            apiContext={apiContext}
            onAuthenticationHandled={() => {
                onHandled();
            }}
            onAuthenticationIgnored={() => {
                onIgnored();
            }}>
            {children}
        </BasicAuthAuthenticationGuard>;
    }
    else {
        return children;
    }
}
import React, {useMemo, useState} from "react";
import {AuthLocalStorage} from "@/app/lib/localstorage/AuthLocalStorage";
import StaticAuthenticationModal from "@/app/components/authentication/static/StaticAuthenticationModal";
import {ApiContext} from "@/app/lib/model/ApiContext";

export interface BearerSecuritySchemeAuthenticationGuardProps {
    apiContext: ApiContext
    onAuthenticationHandled: () => void,
    onAuthenticationIgnored: () => void
    children: React.ReactNode
}

export const BearerSecuritySchemeAuthenticationGuard = ({
                                                            apiContext,
                                                            onAuthenticationHandled,
                                                            onAuthenticationIgnored,
                                                            children
                                                        }: BearerSecuritySchemeAuthenticationGuardProps) => {

    const [open, setOpen] = useState<boolean>(true);

    const defaultAuthentication = useMemo(() => {
        return AuthLocalStorage.getStaticAuthCredentials(apiContext);
    }, [apiContext.apiSpec.id]);

    if (!defaultAuthentication?.secret) {
        return (
            <StaticAuthenticationModal
                apiContext={apiContext}
                open={open}
                onClose={() => { setOpen(false); onAuthenticationIgnored(); }}
                onStaticAuthenticationSubmit={(credentials) => {
                    AuthLocalStorage.setStaticAuthCredentials(apiContext, credentials);
                    setOpen(false);
                    onAuthenticationHandled();
                }} />
        )
    } else {
        return children;
    }
}
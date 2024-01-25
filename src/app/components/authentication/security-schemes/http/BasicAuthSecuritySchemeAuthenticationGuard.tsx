import BasicAuthModal from "@/app/components/authentication/basic-auth/BasicAuthModal";
import {ApiContext} from "@/app/lib/model/ApiContext";
import React, {useMemo, useState} from "react";
import {AuthLocalStorage} from "@/app/lib/localstorage/AuthLocalStorage";
import {Box} from "@mui/joy";

export interface BasicAuthSecuritySchemeAuthenticationGuardProps {
    apiContext: ApiContext
    onAuthenticationHandled: () => void
    onAuthenticationIgnored: () => void
    children: React.ReactNode
}

export const BasicAuthSecuritySchemeAuthenticationGuard = ({apiContext, onAuthenticationHandled, onAuthenticationIgnored, children}: BasicAuthSecuritySchemeAuthenticationGuardProps) => {
    const defaultCredentials = useMemo(() => {
        return AuthLocalStorage.getBasicAuthCredentials(apiContext);
    }, [apiContext.apiSpec.id]);
    const [open, setOpen] = useState<boolean>(true);

    if (!defaultCredentials?.username || !defaultCredentials?.password) {
        return (
            <Box>
                <BasicAuthModal
                    apiContext={apiContext}
                    open={open}
                    onClose={() => { setOpen(false); onAuthenticationIgnored(); }}
                    onBasicAuthSubmit={(credentials) => {
                        AuthLocalStorage.setBasicAuthCredentials(apiContext, credentials);
                        setOpen(false);
                        onAuthenticationHandled();
                    }}
                />
            </Box>
        )
    } else {
        return children;
    }
}
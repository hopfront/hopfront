import { ApiContext } from "@/app/lib/model/ApiContext";
import { useMemo, useState } from "react";
import StaticAuthenticationModal from "./StaticAuthenticationModal";
import {AuthLocalStorage} from "@/app/lib/localstorage/AuthLocalStorage";

export interface StaticAuthenticationGuardProps {
    apiContext: ApiContext,
    onAuthenticationHandled: () => void,
    onAuthenticationIgnored: () => void,
    children?: React.ReactNode,
}

export default function StaticAuthenticationGuard({
    apiContext,
    onAuthenticationHandled,
    onAuthenticationIgnored,
    children
}: StaticAuthenticationGuardProps) {
    const authenticationConfig = apiContext.config.authenticationConfig;
    const [open, setOpen] = useState<boolean>(true);
    const defaultAuthentication = useMemo(() => {
        return AuthLocalStorage.getStaticAuthCredentials(apiContext.apiSpec.id);
    }, [apiContext.apiSpec.id]);

    if (authenticationConfig?.authenticationType === 'STATIC' && (!defaultAuthentication?.secret)) {
        return (
            <StaticAuthenticationModal
                apiContext={apiContext}
                open={open}
                onClose={() => { setOpen(false); onAuthenticationIgnored(); }}
                onStaticAuthenticationSubmit={(credentials) => {
                    AuthLocalStorage.setStaticAuthCredentials(apiContext.apiSpec.id, credentials);
                    setOpen(false);
                    onAuthenticationHandled();
                }} />
        )
    } else {
        return children;
    }

};
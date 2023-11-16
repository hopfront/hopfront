import { ApiContext } from "@/app/lib/model/ApiContext";
import { Box } from "@mui/joy";
import { useMemo, useState } from "react";
import BasicAuthModal from "./BasicAuthModal";
import {AuthLocalStorage} from "@/app/lib/localstorage/AuthLocalStorage";

export interface BasicAuthFormProps {
    apiContext: ApiContext,
    onAuthenticationHandled: () => void,
    onAuthenticationIgnored: () => void,
    children: React.ReactNode
}

export default function BasicAuthAuthenticationGuard({ apiContext, onAuthenticationHandled, onAuthenticationIgnored, children }: BasicAuthFormProps) {
    const apiAuthenticationConfig = apiContext.config.authenticationConfig;
    const defaultCredentials = useMemo(() => {
        return AuthLocalStorage.getBasicAuthCredentials(apiContext);
    }, [apiContext.apiSpec.id]);
    const [open, setOpen] = useState<boolean>(true);

    if (apiAuthenticationConfig?.authenticationType === "BASIC_AUTH" && !defaultCredentials?.username || !defaultCredentials?.password) {
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
import React, {useMemo, useState} from "react";
import {ApiContext} from "@/app/lib/model/ApiContext";
import {AuthLocalStorage} from "@/app/lib/localstorage/AuthLocalStorage";
import {ResponsiveModal} from "@/app/components/modal/ResponsiveModal";
import {Button, FormControl, FormLabel} from "@mui/joy";
import {ManualInput} from "@/app/components/input/ManualInput";
import {ButtonRow} from "@/app/components/button/ButtonRow";

export interface ApiKeySecuritySchemeAuthenticationGuardProps {
    apiContext: ApiContext
    onAuthenticationHandled: () => void
    onAuthenticationIgnored: () => void
    children: React.ReactNode
}

export const ApiKeySecuritySchemeAuthenticationGuard = ({
                                                            apiContext,
                                                            onAuthenticationHandled,
                                                            onAuthenticationIgnored,
                                                            children
                                                        }: ApiKeySecuritySchemeAuthenticationGuardProps) => {

    const [open, setOpen] = useState<boolean>(true);

    const defaultApiKeyCredentials = useMemo(() => {
        return AuthLocalStorage.getApiKeyAuthCredentials(apiContext);
    }, [apiContext.apiSpec.id]);

    const [apiKey, setApiKey] = useState<string | undefined>(defaultApiKeyCredentials?.apiKey);

    if (!defaultApiKeyCredentials?.apiKey) {
        return (
            <ResponsiveModal
                open={open}
                onClose={() => {
                    setOpen(false);
                    onAuthenticationIgnored();
                }}>

                <FormControl>
                    <FormLabel>API Key</FormLabel>
                    <ManualInput type="text" updatableValue={{
                        value: defaultApiKeyCredentials?.apiKey,
                        onValueUpdate: newApiKey => {
                            setApiKey(newApiKey);
                        }
                    }}/>
                </FormControl>
                <ButtonRow align="right">
                    <Button variant="outlined" onClick={() => {
                        setOpen(false);
                        onAuthenticationIgnored();
                    }}>
                        Cancel
                    </Button>
                    <Button
                        disabled={!apiKey}
                        onClick={() => {
                            if (!apiKey) {
                                // This should never happen because of the condition in the "disabled" property
                                return;
                            }

                            AuthLocalStorage.setApiKeyAuthCredentials(apiContext, {apiKey: apiKey});
                            setOpen(false);
                            onAuthenticationHandled();
                        }}>
                        Submit
                    </Button>
                </ButtonRow>
            </ResponsiveModal>
        )
    } else {
        return children;
    }
}
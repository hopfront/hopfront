import React, {useMemo, useState} from "react";
import {AuthLocalStorage} from "@/app/lib/localstorage/AuthLocalStorage";
import {ApiContext} from "@/app/lib/model/ApiContext";
import {ResponsiveModal} from "@/app/components/modal/ResponsiveModal";
import {Button, FormControl, FormLabel} from "@mui/joy";
import {ManualInput} from "@/app/components/input/ManualInput";
import {ButtonRow} from "@/app/components/button/ButtonRow";

export interface BearerStaticSecuritySchemeAuthenticationGuardProps {
    apiContext: ApiContext
    onAuthenticationHandled: () => void,
    onAuthenticationIgnored: () => void
    children: React.ReactNode
}

export const BearerStaticSecuritySchemeAuthenticationGuard = ({
                                                            apiContext,
                                                            onAuthenticationHandled,
                                                            onAuthenticationIgnored,
                                                            children
                                                        }: BearerStaticSecuritySchemeAuthenticationGuardProps) => {

    const [open, setOpen] = useState<boolean>(true);

    const defaultBearerAuth = useMemo(() => {
        return AuthLocalStorage.getBearerAuthCredentials(apiContext);
    }, [apiContext.apiSpec.id]);

    const [bearer, setBearer] = useState<string | undefined>(defaultBearerAuth?.bearer);

    if (!defaultBearerAuth?.bearer) {
        return (
            <ResponsiveModal
                open={open}
                onClose={() => {
                    setOpen(false);
                    onAuthenticationIgnored();
                }}>

                <FormControl>
                    <FormLabel>Bearer</FormLabel>
                    <ManualInput type="text" updatableValue={{
                        value: defaultBearerAuth?.bearer,
                        onValueUpdate: newBearer => {
                            setBearer(newBearer);
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
                        disabled={!bearer}
                        onClick={() => {
                            if (!bearer) {
                                // This should never happen because of the condition in the "disabled" property
                                return;
                            }

                            AuthLocalStorage.setBearerAuthCredentials(apiContext, {bearer: bearer});
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
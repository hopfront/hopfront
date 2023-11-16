import { AuthenticationType } from "@/app/lib/dto/ApiAuthenticationConfig";
import { LockOpenOutlined, LockOutlined } from "@mui/icons-material";
import { useState } from "react";
import BasicAuthModal from "./basic-auth/BasicAuthModal";
import { ApiContext } from "@/app/lib/model/ApiContext";
import StaticAuthenticationModal from "./static/StaticAuthenticationModal";
import { AccessTokenAuthenticationModal } from "./access-token/AccessTokenAuthenticationModal";
import { AuthLocalStorage, BasicAuthCredentials, StaticAuthCredentials } from "@/app/lib/localstorage/AuthLocalStorage";
import { AuthService } from "@/app/lib/service/AuthService";
import IconButton from "@mui/joy/IconButton";

interface AuthenticationBadgeProps {
    apiContext: ApiContext
}

const getSelectedTypeName = (type: AuthenticationType) => {
    switch (type) {
        case 'STATIC':
            return 'Static Auth';
        case 'BASIC_AUTH':
            return 'Basic Auth';
        case 'ACCESS_TOKEN':
            return 'Access Token';
        default:
            return 'None';
    }
}

export const AuthenticationBadge = ({ apiContext }: AuthenticationBadgeProps) => {
    const [open, setOpen] = useState(false);
    const authenticationConfig = apiContext.config.authenticationConfig;

    const authenticationStatus = AuthService.getApiAuthenticationStatus(apiContext);

    if (!authenticationStatus.isAuthenticationRequired) {
        return null;
    }

    const onClick = () => {
        setOpen(true);
    }

    const onBasicAuthSubmit = (basicAuth: BasicAuthCredentials) => {
        AuthLocalStorage.setBasicAuthCredentials(apiContext, basicAuth);
        setOpen(false);
    }

    const onStaticAuthSubmit = (secret: StaticAuthCredentials) => {
        AuthLocalStorage.setStaticAuthCredentials(apiContext, secret);
        setOpen(false);
    }

    const onAccessTokenSubmit = (accessToken: string) => {
        AuthLocalStorage.setAccessToken(apiContext, accessToken);
        setOpen(false);
    }

    const onClose = () => {
        setOpen(false);
    }

    const authenticatedButton =
        <IconButton
            variant='plain'
            onClick={onClick}
            color="success"
            title={authenticationConfig?.authenticationType && authenticationConfig.authenticationType != 'NONE' ? getSelectedTypeName(authenticationConfig.authenticationType) : undefined}>
            <LockOutlined />
        </IconButton>

    const noAuthenticationButton =
        <IconButton
            variant='plain'
            onClick={onClick}
            color="warning"
            title={authenticationConfig?.authenticationType && authenticationConfig.authenticationType != 'NONE' ? getSelectedTypeName(authenticationConfig.authenticationType) : undefined}>
            <LockOpenOutlined />
        </IconButton>

    return (
        <>
            {authenticationStatus.isAuthenticated ? authenticatedButton : noAuthenticationButton}
            {authenticationConfig?.authenticationType === 'BASIC_AUTH' &&
                <BasicAuthModal
                    apiContext={apiContext}
                    open={open}
                    onClose={onClose}
                    onBasicAuthSubmit={onBasicAuthSubmit}
                />
            }
            {authenticationConfig?.authenticationType === 'STATIC' &&
                <StaticAuthenticationModal
                    apiContext={apiContext}
                    open={open}
                    onClose={onClose}
                    onStaticAuthenticationSubmit={onStaticAuthSubmit}
                />
            }
            {authenticationConfig?.authenticationType === 'ACCESS_TOKEN' &&
                <AccessTokenAuthenticationModal
                    apiContext={apiContext}
                    open={open}
                    onClose={onClose}
                    onAccessToken={onAccessTokenSubmit}
                />
            }
        </>
    )
}
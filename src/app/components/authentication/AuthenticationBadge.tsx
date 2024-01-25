import {AuthenticationType} from "@/app/lib/dto/ApiAuthenticationConfig";
import {LockOpenOutlined, LockOutlined} from "@mui/icons-material";
import {useState} from "react";
import {ApiContext} from "@/app/lib/model/ApiContext";
import {AccessTokenAuthenticationModal} from "./access-token/AccessTokenAuthenticationModal";
import {AuthLocalStorage} from "@/app/lib/localstorage/AuthLocalStorage";
import {AuthService} from "@/app/lib/service/AuthService";
import IconButton from "@mui/joy/IconButton";

interface AuthenticationBadgeProps {
    apiContext: ApiContext
}

const getSelectedTypeName = (type: AuthenticationType) => {
    switch (type) {
        case 'ACCESS_TOKEN':
            return 'Access Token';
        default:
            return 'None';
    }
}

export const AuthenticationBadge = ({apiContext}: AuthenticationBadgeProps) => {
    const [open, setOpen] = useState(false);
    const authenticationConfig = apiContext.config.authenticationConfig;

    const authenticationStatus = AuthService.getApiAuthenticationStatus(apiContext);

    if (!authenticationStatus.isAuthenticationRequired) {
        return null;
    }

    const onClick = () => {
        setOpen(true);
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
            <LockOutlined/>
        </IconButton>

    const noAuthenticationButton =
        <IconButton
            variant='plain'
            onClick={onClick}
            color="warning"
            title={authenticationConfig?.authenticationType && authenticationConfig.authenticationType != 'NONE' ? getSelectedTypeName(authenticationConfig.authenticationType) : undefined}>
            <LockOpenOutlined/>
        </IconButton>

    return (
        <>
            {authenticationStatus.isAuthenticated ? authenticatedButton : noAuthenticationButton}

            {authenticationConfig?.authenticationType === 'ACCESS_TOKEN' &&
                <AccessTokenAuthenticationModal
                    apiContext={apiContext}
                    open={open}
                    onClose={onClose}
                    onAccessToken={(accessToken: string) => {
                        AuthLocalStorage.setAccessToken(apiContext, accessToken);
                        setOpen(false);
                    }
                    }
                />
            }
        </>
    )
}
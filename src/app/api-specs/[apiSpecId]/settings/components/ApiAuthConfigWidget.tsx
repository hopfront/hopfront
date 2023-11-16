import { InfoAlert } from "@/app/components/alert/InfoAlert"
import { EventType, useSnackbar } from "@/app/hooks/useSnackbar"
import { ApiConfigApi } from "@/app/lib/api/ApiConfigApi"
import { ApiAuthenticationConfig, AuthenticationType } from "@/app/lib/dto/ApiAuthenticationConfig"
import { AuthLocalStorage } from "@/app/lib/localstorage/AuthLocalStorage"
import { ApiContext } from "@/app/lib/model/ApiContext"
import { UpdatableValue } from "@/app/lib/model/UpdatableValue"
import { KeyboardArrowDown } from "@mui/icons-material"
import { Box, CircularProgress, Typography } from "@mui/joy"
import Option from '@mui/joy/Option'
import Select, { selectClasses } from "@mui/joy/Select"
import { useEffect, useMemo, useState } from "react"
import { useDebouncedCallback } from "use-debounce"
import AuthenticationTypeComponent from "./AuthenticationTypeComponent"

interface ApiAuthenticationProps {
    apiContext: ApiContext,
    sx?: {}
}

const getSavedAuthenticationOrDefault = (authenticationConfig: ApiAuthenticationConfig | undefined) => {
    return authenticationConfig || {
        authenticationType: 'NONE'
    };
}

export const ApiAuthConfigWidget = ({ apiContext, sx }: ApiAuthenticationProps) => {
    const [saving, setSaving] = useState(false);
    const debouncedSaveAuthentication = useDebouncedCallback((specId: string, currentAuth: ApiAuthenticationConfig) => {
        setSaving(true);
        ApiConfigApi.saveApiConfig(specId, { authenticationConfig: currentAuth })
            .then(() => {
                if (currentAuth.authenticationType === 'ACCESS_TOKEN') {
                    AuthLocalStorage.setAccessToken(specId, undefined);
                }
            })
            .then(() => showSnackbar(EventType.Success, 'Authentication configuration saved successfully'))
            .catch(reason => showSnackbar(EventType.Error, `Failed to update authentication configuration: ${reason.toLocaleString()}`))
            .finally(() => setSaving(false));
    }, 500);
    const initialAuth = useMemo(() => {
        return getSavedAuthenticationOrDefault(apiContext.config.authenticationConfig);
    }, [apiContext.config.authenticationConfig]);
    const [currentAuth, setCurrentAuth] = useState<ApiAuthenticationConfig>(initialAuth);
    const [authType, setAuthType] = useState<AuthenticationType>(initialAuth.authenticationType);
    const { showSnackbar, Snackbar } = useSnackbar();

    const updateFormCallback = useMemo(() => {
        return {
            value: { ...initialAuth, authenticationType: authType },
            onValueUpdate: (value) => {
                value && setCurrentAuth(value)
            }
        } as UpdatableValue<ApiAuthenticationConfig>
    }, [authType, initialAuth])

    useEffect(() => {
        setCurrentAuth((auth) => ({ ...auth, authenticationType: authType }))
    }, [authType])

    useEffect(() => {
        if (JSON.stringify(currentAuth) !== JSON.stringify(initialAuth)) {
            debouncedSaveAuthentication(apiContext.apiSpec.id, currentAuth);
        }
    }, [currentAuth, initialAuth, apiContext.apiSpec.id])

    return (
        <Box sx={{ ...sx }}>
            <InfoAlert>
                <Typography level='body-sm'>
                    Configure the authentication type and settings for your API requests here. <br />
                    Note that you&apos;re only setting up the authentication method; user credentials will be requested
                    as needed while using HopFront. <br />
                    These settings apply to all API requests made through this configuration.
                </Typography>
            </InfoAlert>
            <form style={{ marginTop: '24px' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', pb: 1 }}>
                    <Select
                        onChange={(_, value) => {
                            setAuthType(value as AuthenticationType);
                        }}
                        indicator={<KeyboardArrowDown />}
                        slotProps={{
                            button: {
                                id: 'import-mode-select',
                                'aria-labelledby': 'select-label select-button',
                            }
                        }}
                        value={authType}
                        endDecorator={saving && <CircularProgress size="sm" />}
                        disabled={saving}
                        sx={{
                            width: '15%',
                            minWidth: '250px',
                            [`& .${selectClasses.indicator}`]: {
                                transition: '0.2s',
                                [`&.${selectClasses.expanded}`]: {
                                    transform: 'rotate(180deg)',
                                },
                            },
                        }}
                    >
                        <Option value="STATIC">Static Header/Query Param</Option>
                        <Option value="BASIC_AUTH">Basic Auth</Option>
                        <Option value="ACCESS_TOKEN">Access Token</Option>
                        <Option value="NONE">None</Option>
                    </Select>
                </Box>
                <AuthenticationTypeComponent
                    type={authType}
                    updateValue={updateFormCallback}
                    disabled={saving}
                    apiSpec={apiContext.apiSpec}
                />
            </form>
            {Snackbar}
        </Box>
    )
}
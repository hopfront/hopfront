import {EventType, useSnackbar} from "@/app/hooks/useSnackbar"
import {ApiConfigApi} from "@/app/lib/api/ApiConfigApi"
import {ApiAuthenticationConfig, AuthenticationType} from "@/app/lib/dto/ApiAuthenticationConfig"
import {AuthLocalStorage} from "@/app/lib/localstorage/AuthLocalStorage"
import {ApiContext} from "@/app/lib/model/ApiContext"
import {UpdatableValue} from "@/app/lib/model/UpdatableValue"
import {KeyboardArrowDown} from "@mui/icons-material"
import {Box, CircularProgress, Link, Typography} from "@mui/joy"
import Option from '@mui/joy/Option'
import Select, {selectClasses} from "@mui/joy/Select"
import React, {useEffect, useMemo, useState} from "react"
import {useDebouncedCallback} from "use-debounce"
import AuthenticationTypeComponent from "../AuthenticationTypeComponent"
import {SecuritySchemeList} from "@/app/api-specs/[apiSpecId]/settings/components/security-schemes/SecuritySchemeList";
import FormControl from "@mui/joy/FormControl";
import {InfoAlert} from "@/app/components/alert/InfoAlert";
import {WarningAlert} from "@/app/components/alert/WarningAlert";
import {SecurityScheme} from "@/app/lib/model/SecurityScheme";

interface ApiAuthenticationProps {
    apiContext: ApiContext,
    sx?: {}
}

const getSavedAuthenticationOrDefault = (authenticationConfig: ApiAuthenticationConfig | undefined) => {
    return authenticationConfig || {
        authenticationType: 'NONE'
    };
}

export const ApiAuthConfigWidget = ({apiContext, sx}: ApiAuthenticationProps) => {
    const [saving, setSaving] = useState(false);
    const debouncedSaveAuthentication = useDebouncedCallback((specId: string, currentAuth: ApiAuthenticationConfig) => {
        setSaving(true);
        ApiConfigApi.saveApiConfig(specId, {authenticationConfig: currentAuth})
            .then(() => {
                if (currentAuth.authenticationType === 'ACCESS_TOKEN') {
                    AuthLocalStorage.setAccessToken(apiContext, undefined);
                }
            })
            .then(() => showSnackbar(EventType.Success, 'Authentication configuration saved successfully'))
            .catch(reason => showSnackbar(EventType.Error, `Failed to update authentication configuration: ${reason.toLocaleString()}`))
            .finally(() => setSaving(false));
    }, 1000);
    const initialAuth = useMemo(() => {
        return getSavedAuthenticationOrDefault(apiContext.config.authenticationConfig);
    }, [apiContext.config.authenticationConfig]);
    const [currentAuth, setCurrentAuth] = useState<ApiAuthenticationConfig>(initialAuth);
    const [authType, setAuthType] = useState<AuthenticationType>(initialAuth.authenticationType);
    const {showSnackbar, Snackbar} = useSnackbar();

    const updateFormCallback = useMemo(() => {
        return {
            value: {...initialAuth, authenticationType: authType},
            onValueUpdate: (value) => {
                value && setCurrentAuth(value)
            }
        } as UpdatableValue<ApiAuthenticationConfig>
    }, [authType, initialAuth])

    useEffect(() => {
        setCurrentAuth((auth) => ({...auth, authenticationType: authType}))
    }, [authType])

    useEffect(() => {
        if (JSON.stringify(currentAuth) !== JSON.stringify(initialAuth)) {
            debouncedSaveAuthentication(apiContext.apiSpec.id, currentAuth);
        }
    }, [currentAuth, initialAuth, apiContext.apiSpec.id])

    const securitySchemeComponents = (apiContext.apiSpec.document.components?.securitySchemes || {});

    const securitySchemes = Object.keys(securitySchemeComponents).map(securitySchemeKey => {
        return {
            key: securitySchemeKey,
            object: securitySchemeComponents[securitySchemeKey]
        } as SecurityScheme
    });

    return (
        <Box sx={{...sx}}>
            <InfoAlert title="Need help configuring your API's authentication?" sx={{mb: 2}}>
                <Typography level="body-sm">
                    You can either:<br/>
                    - create a <Link href="https://github.com/hopfront/hopfront/issues/" target="_blank">GitHub issue</Link>,<br/>
                    - send an email at:<Link href="mailto:support@hopfront.com">support@hopfront.com</Link>.<br/>
                </Typography>
            </InfoAlert>
            <SecuritySchemeList securitySchemes={securitySchemes} apiContext={apiContext}/>
            {securitySchemes.length === 0 && <form style={{marginTop: '24px'}}>
                <Box sx={{display: 'flex', alignItems: 'center', pb: 1}}>
                    <FormControl>
                        <Typography level="title-lg"></Typography>
                        <WarningAlert title="Global Authentication">
                            <Typography>Your OpenAPI specification does not specify any authentication method, you can declare a globally applied one bellow.</Typography><br/>
                            <Typography>Please not that specifying your authentication within your OpenAPI spec is the preferred method.</Typography>
                        </WarningAlert>
                        <Select
                            onChange={(_, value) => {
                                setAuthType(value as AuthenticationType);
                            }}
                            indicator={<KeyboardArrowDown/>}
                            slotProps={{
                                button: {
                                    id: 'import-mode-select',
                                    'aria-labelledby': 'select-label select-button',
                                }
                            }}
                            value={authType}
                            endDecorator={saving && <CircularProgress size="sm"/>}
                            disabled={saving}
                            sx={{
                                mt: 2,
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
                            <Option value="ACCESS_TOKEN">Access Token</Option>
                            <Option value="NONE">None</Option>
                        </Select>
                    </FormControl>
                </Box>
                <AuthenticationTypeComponent
                    type={authType}
                    updateValue={updateFormCallback}
                    disabled={saving}
                    apiSpec={apiContext.apiSpec}
                />
            </form>}
            {Snackbar}
        </Box>
    )
}
import {Box, CardContent, FormControl, FormLabel} from "@mui/joy";
import Typography from "@mui/joy/Typography";
import {Monospace} from "@/app/components/typography/Monospace";
import Select from "@mui/joy/Select";
import Option from "@mui/joy/Option";
import {useState} from "react";
import AccessTokenAuthConfigForm
    from "@/app/api-specs/[apiSpecId]/settings/components/global-auth/access-token/AccessTokenAuthConfigForm";
import {ApiAuthenticationAccessTokenConfigData} from "@/app/lib/dto/ApiAuthenticationConfig";
import {ApiContext} from "@/app/lib/model/ApiContext";
import {EventType, useSnackbar} from "@/app/hooks/useSnackbar";
import LinearProgress from "@mui/joy/LinearProgress";
import {ExtensionApi} from "@/app/lib/api/ExtensionApi";

enum TokenSource {
    Static = 'static',
    Endpoint = 'endpoint'
}

export interface HttpBearerSecuritySchemeCardContentProps {
    securitySchemeKey: string
    apiContext: ApiContext
}

export const HttpBearerSecuritySchemeCardContent = ({
                                                        securitySchemeKey,
                                                        apiContext
                                                    }: HttpBearerSecuritySchemeCardContentProps) => {

    const httpBearerExtension = (apiContext.extension?.securitySchemes || [])
        .find(sc => sc.securitySchemeKey === securitySchemeKey)
        ?.httpBearerExtension;

    const [tokenSource, setTokenSource] = useState<TokenSource>(httpBearerExtension?.accessTokenConfig ? TokenSource.Endpoint : TokenSource.Static);
    const [accessTokenConfig, setAccessTokenConfig] = useState<ApiAuthenticationAccessTokenConfigData | undefined>(httpBearerExtension?.accessTokenConfig);
    const {showSnackbar, Snackbar} = useSnackbar();
    const [saving, setSaving] = useState(false);

    return (
        <>
            <CardContent>
                <Box sx={{mt: 1}}>
                    <Typography level="body-sm">Type: <Monospace>Bearer</Monospace></Typography>
                </Box>
                <FormControl sx={{mt: 1}}>
                    <FormLabel>Token source</FormLabel>
                    <Select
                        value={tokenSource}
                        onChange={(event, value) => {
                            if (value) {
                                setTokenSource(value);

                                if (value === TokenSource.Static) {
                                    setAccessTokenConfig(undefined);
                                } else if (value === TokenSource.Endpoint) {
                                    setAccessTokenConfig({} as ApiAuthenticationAccessTokenConfigData);
                                }
                            }
                        }}>
                        <Option value={'static'}>Static value</Option>
                        <Option value={'endpoint'}>Endpoint Call</Option>
                    </Select>
                </FormControl>

                {tokenSource === 'endpoint' && <AccessTokenAuthConfigForm
                    config={{
                        value: accessTokenConfig,
                        onValueUpdate: newAccessTokenConfig => {
                            if (newAccessTokenConfig && newAccessTokenConfig.responseAccessTokenPropertyName) {
                                setSaving(true);
                                setAccessTokenConfig(newAccessTokenConfig);

                                ExtensionApi.saveSecuritySchemeExtension(apiContext.apiSpec.id, {
                                    securitySchemeKey: securitySchemeKey,
                                    httpBearerExtension: {
                                        accessTokenConfig: newAccessTokenConfig,
                                    }
                                })
                                    .then(() => {
                                        showSnackbar(EventType.Success, 'Configuration updated successfully');
                                    })
                                    .catch(reason => showSnackbar(EventType.Error, `Failed to save configuration: ${reason.toLocaleString()}`))
                                    .finally(() => setSaving(false));
                            }
                        }
                    }}
                    disabled={saving}
                    apiSpec={apiContext.apiSpec}/>}
            </CardContent>
            {saving && <LinearProgress/>}
            {Snackbar}
        </>

    );
}
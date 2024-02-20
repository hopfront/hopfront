import AccessTokenAuthConfigForm
    from "@/app/api-specs/[apiSpecId]/settings/components/global-auth/access-token/AccessTokenAuthConfigForm";
import {
    ApiAuthenticationAccessTokenConfigData,
    ApiAuthenticationConfig,
    AuthenticationType
} from "@/app/lib/dto/ApiAuthenticationConfig";
import {ApiSpec} from "@/app/lib/dto/ApiSpec";
import {UpdatableValue} from "@/app/lib/model/UpdatableValue";
import {Box} from "@mui/joy";

interface AuthenticationTypeComponentProps {
    type: AuthenticationType,
    updateValue: UpdatableValue<ApiAuthenticationConfig>,
    disabled: boolean
    apiSpec: ApiSpec
    sx?: {}
}

export default function AuthenticationTypeComponent({
                                                        type,
                                                        updateValue,
                                                        disabled,
                                                        apiSpec,
                                                        sx
                                                    }: AuthenticationTypeComponentProps) {
    const authComponent = () => {
        switch (type) {
            case "ACCESS_TOKEN":
                return <AccessTokenAuthConfigForm
                    config={{
                        value: updateValue.value?.data as ApiAuthenticationAccessTokenConfigData | undefined,
                        onValueUpdate: value => {
                            updateValue.onValueUpdate({
                                authenticationType: "ACCESS_TOKEN",
                                data: value,
                            })
                        }
                    }}
                    disabled={disabled}
                    apiSpec={apiSpec}/>
            default:
                return null;
        }
    }

    return (
        <Box sx={{...sx}}>
            {authComponent()}
        </Box>

    )
}
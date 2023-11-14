import AccessTokenAuthConfigForm from "@/app/api-specs/[apiSpecId]/settings/components/AccessTokenAuthConfigForm";
import { ApiAuthenticationConfig, AuthenticationType } from "@/app/lib/dto/ApiAuthenticationConfig";
import { ApiSpec } from "@/app/lib/dto/ApiSpec";
import { UpdatableValue } from "@/app/lib/model/UpdatableValue";
import { Box } from "@mui/joy";
import StaticAuthConfigForm from "./StaticAuthConfigForm";

interface AuthenticationTypeComponentProps {
    type: AuthenticationType,
    updateValue: UpdatableValue<ApiAuthenticationConfig>,
    disabled: boolean
    apiSpec: ApiSpec
    sx?: {}
}

export default function AuthenticationTypeComponent({ type, updateValue, disabled, apiSpec, sx }: AuthenticationTypeComponentProps) {
    const authComponent = () => {
        switch (type) {
            case 'STATIC':
                return <StaticAuthConfigForm updateValue={updateValue} disabled={disabled} />;
            case 'BASIC_AUTH':
                return null;
            case "ACCESS_TOKEN":
                return <AccessTokenAuthConfigForm auth={updateValue} disabled={disabled} apiSpec={apiSpec} />
            default:
                return null;
        }
    }

    return (
        <Box sx={{ ...sx }}>
            {authComponent()}
        </Box>

    )
}
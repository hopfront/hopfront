import {OpenAPIV3} from "openapi-types";
import {Box, CardContent} from "@mui/joy";
import Typography from "@mui/joy/Typography";
import {WarningAlert} from "@/app/components/alert/WarningAlert";
import OpenIdSecurityScheme = OpenAPIV3.OpenIdSecurityScheme;
import {SecuritySchemeURLTypography} from "@/app/lib/model/SecuritySchemeURLTypography";

export interface OIDCSecuritySchemeCardContentProps {
    oidcSecurityScheme: OpenIdSecurityScheme
}

export const OIDCSecuritySchemeCardContent = ({oidcSecurityScheme}: OIDCSecuritySchemeCardContentProps) => {
    return (
        <CardContent>
            <WarningAlert title="This security scheme is not implemented by HopFront (yet)."/>
            <Box sx={{mt: 1}}>
                {oidcSecurityScheme.description && <Typography level="body-sm">{oidcSecurityScheme.description}</Typography>}
                <Typography level="body-sm">Discovery URL: <SecuritySchemeURLTypography url={oidcSecurityScheme.openIdConnectUrl}/></Typography>
            </Box>
        </CardContent>
    );
}
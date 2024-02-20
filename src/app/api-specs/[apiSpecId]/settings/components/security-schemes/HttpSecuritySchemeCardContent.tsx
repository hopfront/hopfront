import {OpenAPIV3} from "openapi-types";
import {Box, CardContent} from "@mui/joy";
import Typography from "@mui/joy/Typography";
import {Monospace} from "@/app/components/typography/Monospace";
import HttpSecurityScheme = OpenAPIV3.HttpSecurityScheme;
import {
    HttpBearerSecuritySchemeCardContent
} from "@/app/api-specs/[apiSpecId]/settings/components/security-schemes/HttpBearerSecuritySchemeCardContent";
import {ApiContext} from "@/app/lib/model/ApiContext";

export interface HttpSecuritySchemeCardContentProps {
    securitySchemeKey: string
    httpSecurityScheme: HttpSecurityScheme
    apiContext: ApiContext
}

export const HttpSecuritySchemeCardContent = ({securitySchemeKey, httpSecurityScheme, apiContext}: HttpSecuritySchemeCardContentProps) => {
    if (httpSecurityScheme.scheme === 'bearer') {
        return <HttpBearerSecuritySchemeCardContent securitySchemeKey={securitySchemeKey} apiContext={apiContext}/>
    } else {
        return (
            <CardContent>
                <Box sx={{mt: 1}}>
                    <Typography level="body-sm">Type: <Monospace>{httpSecurityScheme.scheme}</Monospace></Typography>
                </Box>
            </CardContent>
        );
    }
}
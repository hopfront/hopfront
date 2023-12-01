import {OpenAPIV3} from "openapi-types";
import {Box, CardContent} from "@mui/joy";
import Typography from "@mui/joy/Typography";
import {Monospace} from "@/app/components/typography/Monospace";
import {WarningAlert} from "@/app/components/alert/WarningAlert";
import HttpSecurityScheme = OpenAPIV3.HttpSecurityScheme;

export interface HttpSecuritySchemeCardContentProps {
    httpSecurityScheme: HttpSecurityScheme
}

export const HttpSecuritySchemeCardContent = ({httpSecurityScheme}: HttpSecuritySchemeCardContentProps) => {
    return (
        <CardContent>
            <WarningAlert title="This security scheme is not implemented by HopFront (yet)."/>
            <Box sx={{mt: 1}}>
                <Typography level="body-sm">Type: <Monospace>{httpSecurityScheme.scheme}</Monospace></Typography>
            </Box>
        </CardContent>
    );
}
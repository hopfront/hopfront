import {OpenAPIV3} from "openapi-types";
import {Box, CardContent} from "@mui/joy";
import Typography from "@mui/joy/Typography";
import {Monospace} from "@/app/components/typography/Monospace";
import HttpSecurityScheme = OpenAPIV3.HttpSecurityScheme;

export interface HttpSecuritySchemeCardContentProps {
    httpSecurityScheme: HttpSecurityScheme
}

export const HttpSecuritySchemeCardContent = ({httpSecurityScheme}: HttpSecuritySchemeCardContentProps) => {
    return (
        <CardContent>
            <Box sx={{mt: 1}}>
                <Typography level="body-sm">Type: <Monospace>{httpSecurityScheme.scheme}</Monospace></Typography>
            </Box>
        </CardContent>
    );
}
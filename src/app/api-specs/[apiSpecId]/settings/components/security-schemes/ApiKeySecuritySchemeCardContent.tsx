import {OpenAPIV3} from "openapi-types";
import {Box, CardContent} from "@mui/joy";
import ApiKeySecurityScheme = OpenAPIV3.ApiKeySecurityScheme;
import Typography from "@mui/joy/Typography";
import {Monospace} from "@/app/components/typography/Monospace";

export interface ApiKeySecuritySchemeCardContentProps {
    apiKeySecurityScheme: ApiKeySecurityScheme
}

export const ApiKeySecuritySchemeCardContent = ({apiKeySecurityScheme}: ApiKeySecuritySchemeCardContentProps) => {
    return (
        <CardContent>
            <Box sx={{mt: 1}}>
                {apiKeySecurityScheme.description &&
                    <Typography level="body-sm">{apiKeySecurityScheme.description}</Typography>}
                <Typography level="body-sm">In: <Monospace>{apiKeySecurityScheme.in}</Monospace></Typography>
                <Typography level="body-sm">Name: <Monospace>{apiKeySecurityScheme.name}</Monospace></Typography>
            </Box>
        </CardContent>
    );
}
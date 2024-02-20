import {ApiContext} from "@/app/lib/model/ApiContext";
import {SecurityScheme} from "@/app/lib/model/SecurityScheme";
import Card from "@mui/joy/Card";
import Typography from "@mui/joy/Typography";
import Chip from "@mui/joy/Chip";
import {SecuritySchemeCardContent} from "@/app/api-specs/[apiSpecId]/settings/components/security-schemes/SecuritySchemeCardContent";
import {Monospace} from "@/app/components/typography/Monospace";
import {Lock} from "@mui/icons-material";

export interface SecuritySchemeListProps {
    securitySchemes: SecurityScheme[]
    apiContext: ApiContext
}

export const SecuritySchemeList = ({securitySchemes, apiContext}: SecuritySchemeListProps) => {
    if (securitySchemes.length === 0) {
        return null;
    }

    return (
        <>
            <Typography level="title-lg">Security Schemes</Typography>
            <Typography level="body-sm" sx={{mb: 1}}>Below are the security schemes provided by the imported OpenAPI specification.</Typography>
            {securitySchemes.map(securityScheme => {
                return (
                    <Card key={securityScheme.key} sx={{mb: 1}}>
                        <Typography
                            level="title-md"
                            startDecorator={<Lock/>}
                            endDecorator={<Chip color="primary"><Monospace>{securityScheme.object.type}</Monospace></Chip>}>
                            {securityScheme.key}
                        </Typography>
                        <SecuritySchemeCardContent
                            securitySchemeKey={securityScheme.key}
                            securitySchemeObject={securityScheme.object}
                            apiContext={apiContext}/>
                    </Card>
                );
            })}
        </>
    );
}
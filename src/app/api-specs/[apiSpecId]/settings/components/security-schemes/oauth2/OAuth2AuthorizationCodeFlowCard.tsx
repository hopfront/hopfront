import {OpenAPIV3} from "openapi-types";
import OAuth2SecurityScheme = OpenAPIV3.OAuth2SecurityScheme;
import Card from "@mui/joy/Card";
import Typography from "@mui/joy/Typography";
import {WarningAlert} from "@/app/components/alert/WarningAlert";
import {SecuritySchemeURLTypography} from "@/app/lib/model/SecuritySchemeURLTypography";
import {getScopesFromRecord} from "@/app/lib/model/OAuth2Scope";
import Chip from "@mui/joy/Chip";

export interface OAuth2AuthorizationCodeSecuritySchemeCardContentProps {
    oauth2SecurityScheme: OAuth2SecurityScheme
}

export const OAuth2AuthorizationCodeFlowCard = ({oauth2SecurityScheme}: OAuth2AuthorizationCodeSecuritySchemeCardContentProps) => {
    if (!oauth2SecurityScheme.flows.authorizationCode) {
        return <WarningAlert title="Could not get authorization code flow data."/>;
    }

    return (
        <Card variant="soft">
            <Typography level="title-sm">Authorization Code Flow</Typography>
            <Typography level="body-sm">Authorization URL: <SecuritySchemeURLTypography url={oauth2SecurityScheme.flows.authorizationCode.authorizationUrl}/></Typography>
            <Typography level="body-sm">Token URL: <SecuritySchemeURLTypography url={oauth2SecurityScheme.flows.authorizationCode.tokenUrl}/></Typography>
            <Typography level="body-sm">Refresh URL: <SecuritySchemeURLTypography url={oauth2SecurityScheme.flows.authorizationCode.refreshUrl}/></Typography>
            <Typography>Scopes: {oauth2SecurityScheme.flows.authorizationCode.scopes && getScopesFromRecord(oauth2SecurityScheme.flows.authorizationCode.scopes).map(scope => {
                return (
                    <Chip variant="outlined" key={scope.code} sx={{ml: 1}}>{scope.code}</Chip>
                );
            })}</Typography>
        </Card>
    );
}
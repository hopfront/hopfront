import Card from "@mui/joy/Card";
import {WarningAlert} from "@/app/components/alert/WarningAlert";
import Typography from "@mui/joy/Typography";
import {OpenAPIV3} from "openapi-types";
import OAuth2SecurityScheme = OpenAPIV3.OAuth2SecurityScheme;
import {getScopesFromRecord} from "@/app/lib/model/OAuth2Scope";
import Chip from "@mui/joy/Chip";
import {SecuritySchemeURLTypography} from "@/app/lib/model/SecuritySchemeURLTypography";

export interface OAuth2ImplicitFlowCardProps {
    oauth2SecurityScheme: OAuth2SecurityScheme
}

export const OAuth2ImplicitFlowCard = ({oauth2SecurityScheme}: OAuth2ImplicitFlowCardProps) => {
    if (!oauth2SecurityScheme.flows.implicit) {
        return <WarningAlert title="Cannot get implicit flow data"/>;
    }

    return (
        <Card variant="soft">
            <Typography level="title-sm">Implicit Flow</Typography>
            <WarningAlert title="This flow is not implemented by HopFront. Note that the Authorization Code flow (with PKCE) is a more secure solution."/>
            <Typography>Authorization URL: <SecuritySchemeURLTypography url={oauth2SecurityScheme.flows.implicit.authorizationUrl}/></Typography>
            <Typography>Refresh URL: <SecuritySchemeURLTypography url={oauth2SecurityScheme.flows.implicit.refreshUrl}/></Typography>
            <Typography>Scopes: {oauth2SecurityScheme.flows.implicit?.scopes && getScopesFromRecord(oauth2SecurityScheme.flows.implicit?.scopes).map(scope => {
                return (
                    <Chip variant="outlined" key={scope.code} sx={{mr: 1}}>{scope.code}</Chip>
                );
            })}</Typography>
        </Card>
    );
}
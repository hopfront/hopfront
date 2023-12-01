import {OpenAPIV3} from "openapi-types";
import OAuth2SecurityScheme = OpenAPIV3.OAuth2SecurityScheme;
import {CardContent} from "@mui/joy";
import {
    OAuth2AuthorizationCodeFlowCard
} from "@/app/api-specs/[apiSpecId]/settings/components/security-schemes/OAuth2AuthorizationCodeFlowCard";
import {
    OAuth2ImplicitFlowCard
} from "@/app/api-specs/[apiSpecId]/settings/components/security-schemes/OAuth2ImplicitFlowCard";
import {
    OAuth2PasswordFlowCard
} from "@/app/api-specs/[apiSpecId]/settings/components/security-schemes/OAuth2PasswordFlowCard";
import {
    OAuth2ClientCredentialsFlowCard
} from "@/app/api-specs/[apiSpecId]/settings/components/security-schemes/OAuth2ClientCredentialsFlowCard";

export interface OAuth2SecuritySchemeCardContentProps {
    oauth2SecurityScheme: OAuth2SecurityScheme
}

export const OAuth2SecuritySchemeCardContent = ({oauth2SecurityScheme}: OAuth2SecuritySchemeCardContentProps) => {
    return (
      <CardContent>
          {oauth2SecurityScheme.flows.authorizationCode && <OAuth2AuthorizationCodeFlowCard oauth2SecurityScheme={oauth2SecurityScheme}/>}
          {oauth2SecurityScheme.flows.implicit && <OAuth2ImplicitFlowCard oauth2SecurityScheme={oauth2SecurityScheme}/>}
          {oauth2SecurityScheme.flows.password && <OAuth2PasswordFlowCard/>}
          {oauth2SecurityScheme.flows.clientCredentials && <OAuth2ClientCredentialsFlowCard/>}
      </CardContent>
    );
}
import {OpenAPIV3} from "openapi-types";
import {
    OAuth2SecuritySchemeCardContent
} from "@/app/api-specs/[apiSpecId]/settings/components/security-schemes/oauth2/OAuth2SecuritySchemeCardContent";
import {
    NotImplementedSecuritySchemeCardContent
} from "@/app/api-specs/[apiSpecId]/settings/components/security-schemes/NotImplementedSecuritySchemeCardContent";
import {
    ApiKeySecuritySchemeCardContent
} from "@/app/api-specs/[apiSpecId]/settings/components/security-schemes/ApiKeySecuritySchemeCardContent";
import {
    HttpSecuritySchemeCardContent
} from "@/app/api-specs/[apiSpecId]/settings/components/security-schemes/HttpSecuritySchemeCardContent";
import {
    OIDCSecuritySchemeCardContent
} from "@/app/api-specs/[apiSpecId]/settings/components/security-schemes/OIDCSecuritySchemeCardContent";
import {ApiContext} from "@/app/lib/model/ApiContext";
import SecuritySchemeObject = OpenAPIV3.SecuritySchemeObject;

export interface SecuritySchemeCardContentProps {
    securitySchemeKey: string
    securitySchemeObject: SecuritySchemeObject
    apiContext: ApiContext
}

export const SecuritySchemeCardContent = ({securitySchemeKey, securitySchemeObject, apiContext}: SecuritySchemeCardContentProps) => {
    switch (securitySchemeObject.type) {
        case "oauth2": return <OAuth2SecuritySchemeCardContent oauth2SecurityScheme={securitySchemeObject}/>;
        case "apiKey": return <ApiKeySecuritySchemeCardContent apiKeySecurityScheme={securitySchemeObject}/>;
        case "http": return <HttpSecuritySchemeCardContent
            securitySchemeKey={securitySchemeKey}
            httpSecurityScheme={securitySchemeObject}
            apiContext={apiContext}/>;
        case "openIdConnect": return <OIDCSecuritySchemeCardContent oidcSecurityScheme={securitySchemeObject}/>
        default:  return <NotImplementedSecuritySchemeCardContent/>
    }
}
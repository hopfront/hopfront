import { ApiContext } from "../model/ApiContext";
import { ServerLocalStorage } from "./ServerLocalStorage";
import {
    buildSecuritySchemeLocalStorageKeyPrefix
} from "@/app/components/authentication/security-schemes/oauth2/OAuth2AuthenticationGuard";
import { tryGetFromLocalStorage, trySetToLocalStorage } from "./utils";

const buildAccessTokenLocalStorageKey = (apiSpecId: string, apiServerUrl: string) => {
    return `com.hopfront.api.${apiSpecId}.${apiServerUrl}.access-token`;
}

const buildBasicAuthLocalStorageKey = (apiSpecId: string, apiServerUrl: string) => {
    return `com.hopfront.api.${apiSpecId}.${apiServerUrl}.basic-auth`;
}

const buildBearerAuthLocalStorageKey = (apiSpecId: string, apiServerUrl: string) => {
    return `com.hopfront.api.${apiSpecId}.${apiServerUrl}.bearer`;
}

const buildApiKeyAuthLocalStorageKey = (apiSpecId: string, apiServerUrl: string) => {
    return `com.hopfront.api.${apiSpecId}.${apiServerUrl}.api-key`;
}

const buildDoNotShowAgainCorsWarningLocalStorageKey = (apiSpecId: string) => {
    return `com.hopfront.api.${apiSpecId}.do-not-show-again-cors-warning`;
}

export interface BasicAuthCredentials {
    username: string,
    password: string
}

export interface BearerAuthCredentials {
    bearer: string
}

export interface ApiKeyAuthCredentials {
    apiKey: string
}

type AuthType = string | BasicAuthCredentials | BearerAuthCredentials | ApiKeyAuthCredentials;

export class AuthLocalStorage {
    private static setAuth(apiContext: ApiContext, callback: (specId: string, apiServerUrl: string) => void) {
        const serverUrl = ServerLocalStorage.getApiServer(apiContext)?.url;
        if (!serverUrl) {
            return;
        }
        callback(apiContext.apiSpec.id, serverUrl);
    }

    private static getAuth(apiContext: ApiContext, callback: (specId: string, apiServerUrl: string) => AuthType | undefined): AuthType | undefined {
        const serverUrl = ServerLocalStorage.getApiServer(apiContext)?.url;
        if (!serverUrl) {
            return;
        }

        return callback(apiContext.apiSpec.id, serverUrl);
    }

    public static setAccessToken(apiContext: ApiContext, accessToken: string | undefined) {
        this.setAuth(apiContext, (specId, apiServerUrl) => {
            trySetToLocalStorage(buildAccessTokenLocalStorageKey(specId, apiServerUrl), accessToken ?? '');
        });
    }

    public static getAccessToken(apiContext: ApiContext): string | null {
        return this.getAuth(apiContext, (specId, apiServerUrl) => {
            return localStorage.getItem(buildAccessTokenLocalStorageKey(specId, apiServerUrl)) as string;
        }) as string | null;
    }

    public static getSecuritySchemeOauth2AccessToken(securitySchemeKey: string): string | undefined {
        // This is a little trick used to retrieve the OAuth2 access token stored by the "react-oauth2-code-pkce" library.
        // This is not the "intended" way to retrieve the accessToken because the library recommends using a Context,
        // but it works.
        const oauth2AccessTokenLocalStorageKey = buildSecuritySchemeLocalStorageKeyPrefix(securitySchemeKey) + 'token';

        // The react-oauth2-code-pkce library stores the token surrounded by double quotes ("), so we remove them.
        // Why does it do it? Maybe we should not remove them.
        return localStorage.getItem(oauth2AccessTokenLocalStorageKey)?.replace('"', '') || undefined;
    }

    public static setBasicAuthCredentials(apiContext: ApiContext, credentials: BasicAuthCredentials) {
        this.setAuth(apiContext, (specId, apiServerUrl) => {
            trySetToLocalStorage(buildBasicAuthLocalStorageKey(specId, apiServerUrl), JSON.stringify(credentials));
        });
    }

    public static getBasicAuthCredentials(apiContext: ApiContext): BasicAuthCredentials | undefined {
        return this.getAuth(apiContext, (specId, apiServerUrl) => {
            return tryGetFromLocalStorage<BasicAuthCredentials>(buildBasicAuthLocalStorageKey(specId, apiServerUrl));
        }) as BasicAuthCredentials | undefined;
    }

    public static setBearerAuthCredentials(apiContext: ApiContext, credentials: BearerAuthCredentials) {
        this.setAuth(apiContext, (specId, apiServerUrl) => {
            trySetToLocalStorage(buildBearerAuthLocalStorageKey(specId, apiServerUrl), JSON.stringify(credentials));
        });
    }

    public static getBearerAuthCredentials(apiContext: ApiContext): BearerAuthCredentials | undefined {
        return this.getAuth(apiContext, (specId, apiServerUrl) => {
            return tryGetFromLocalStorage<BearerAuthCredentials>(buildBearerAuthLocalStorageKey(specId, apiServerUrl));
        }) as BearerAuthCredentials | undefined;
    }

    public static getApiKeyAuthCredentials(apiContext: ApiContext): ApiKeyAuthCredentials | undefined {
        return this.getAuth(apiContext, (specId, apiServerUrl) => {
            return tryGetFromLocalStorage<ApiKeyAuthCredentials>(buildApiKeyAuthLocalStorageKey(specId, apiServerUrl));
        }) as ApiKeyAuthCredentials | undefined;
    }

    public static setApiKeyAuthCredentials(apiContext: ApiContext, credentials: ApiKeyAuthCredentials) {
        this.setAuth(apiContext, (specId, apiServerUrl) => {
            trySetToLocalStorage(buildApiKeyAuthLocalStorageKey(specId, apiServerUrl), JSON.stringify(credentials));
        });
    }

    public static getDoNotShowAgainCorsWarning(apiSpecId: string): boolean | undefined {
        return tryGetFromLocalStorage<boolean>(buildDoNotShowAgainCorsWarningLocalStorageKey(apiSpecId));
    }

    public static setDoNotShowAgainCorsWarning(apiSpecId: string, doNotShowAgain: boolean) {
        trySetToLocalStorage(buildDoNotShowAgainCorsWarningLocalStorageKey(apiSpecId), JSON.stringify(doNotShowAgain));
    }
}
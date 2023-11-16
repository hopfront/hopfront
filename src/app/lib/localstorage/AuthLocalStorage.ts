import { ApiContext } from "../model/ApiContext";
import { ServerLocalStorage } from "./ServerLocalStorage";

const buildAccessTokenLocalStorageKey = (apiSpecId: string, apiServerUrl: string) => {
    return `com.hopfront.api.${apiSpecId}.${apiServerUrl}access-token`;
}

const buildBasicAuthLocalStorageKey = (apiSpecId: string, apiServerUrl: string) => {
    return `com.hopfront.api.${apiSpecId}.${apiServerUrl}.basic-auth`;
}

const buildStaticAuthLocalStorageKey = (apiSpecId: string, apiServerUrl: string) => {
    return `com.hopfront.api.${apiSpecId}.${apiServerUrl}.static-auth`;
}

export interface BasicAuthCredentials {
    username: string,
    password: string
}

export interface StaticAuthCredentials {
    secret: string
}

type AuthType = string | BasicAuthCredentials | StaticAuthCredentials;

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
            this.trySetToLocalStorage(buildAccessTokenLocalStorageKey(specId, apiServerUrl), accessToken ?? '');
        });
    }

    public static getAccessToken(apiContext: ApiContext): string | null {
        return this.getAuth(apiContext, (specId, apiServerUrl) => {
            return localStorage.getItem(buildAccessTokenLocalStorageKey(specId, apiServerUrl)) as string;
        }) as string | null;
    }

    public static setBasicAuthCredentials(apiContext: ApiContext, credentials: BasicAuthCredentials) {
        this.setAuth(apiContext, (specId, apiServerUrl) => {
            this.trySetToLocalStorage(buildBasicAuthLocalStorageKey(specId, apiServerUrl), JSON.stringify(credentials));
        });
    }

    public static getBasicAuthCredentials(apiContext: ApiContext): BasicAuthCredentials | undefined {
        return this.getAuth(apiContext, (specId, apiServerUrl) => {
            return this.tryGetFromLocalStorage<BasicAuthCredentials>(buildBasicAuthLocalStorageKey(specId, apiServerUrl));
        }) as BasicAuthCredentials | undefined;
    }

    public static setStaticAuthCredentials(apiContext: ApiContext, credentials: StaticAuthCredentials) {
        this.setAuth(apiContext, (specId, apiServerUrl) => {
            this.trySetToLocalStorage(buildStaticAuthLocalStorageKey(specId, apiServerUrl), JSON.stringify(credentials));
        });
    }

    public static getStaticAuthCredentials(apiContext: ApiContext): StaticAuthCredentials | undefined {
        return this.getAuth(apiContext, (specId, apiServerUrl) => {
            return this.tryGetFromLocalStorage<StaticAuthCredentials>(buildStaticAuthLocalStorageKey(specId, apiServerUrl));
        }) as StaticAuthCredentials | undefined;
    }

    public static trySetToLocalStorage(key: string, value: string) {
        if (typeof window === 'undefined') {
            return;
        }

        localStorage.setItem(key, value);
    }

    public static tryGetFromLocalStorage<T>(key: string): T | undefined {
        if (typeof window === 'undefined') {
            return;
        }

        const value = localStorage.getItem(key);
        if (value) {
            try {
                return JSON.parse(value) as T;
            } catch (e) {
                return;
            }
        }

        return;
    }
}
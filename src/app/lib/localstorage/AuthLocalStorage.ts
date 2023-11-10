const buildAccessTokenLocalStorageKey = (apiSpecId: string) => {
    return `com.hopfront.api.${apiSpecId}.access-token`;
}

const buildBasicAuthLocalStorageKey = (apiSpecId: string) => {
    return `com.hopfront.api.${apiSpecId}.basic-auth`;
}

const buildStaticAuthLocalStorageKey = (apiSpecId: string) => {
    return `com.hopfront.api.${apiSpecId}.static-auth`;
}

export interface BasicAuthCredentials {
    username: string,
    password: string
}

export interface StaticAuthCredentials {
    secret: string
}

export class AuthLocalStorage {

    public static setAccessToken(accessToken: string, apiSpecId: string) {
        if (typeof window === 'undefined') {
            return;
        }
        localStorage.setItem(buildAccessTokenLocalStorageKey(apiSpecId), accessToken);
    }

    public static getAccessToken(apiSpecId: string | undefined): string | null {
        if (!apiSpecId) {
            return null;
        }

        if (typeof window === 'undefined') {
            return null;
        }

        return localStorage.getItem(buildAccessTokenLocalStorageKey(apiSpecId));
    }

    public static setBasicAuthCredentials(specId: string, credentials: BasicAuthCredentials) {
        if (typeof window === 'undefined') {
            return;
        }

        localStorage.setItem(buildBasicAuthLocalStorageKey(specId), JSON.stringify(credentials));
    }

    public static getBasicAuthCredentials(specId: string): BasicAuthCredentials | undefined {
        return this.tryGetFromLocalStorage<BasicAuthCredentials>(buildBasicAuthLocalStorageKey(specId));
    }

    public static setStaticAuthCredentials(specId: string, credentials: StaticAuthCredentials) {
        if (typeof window === 'undefined') {
            return;
        }

        localStorage.setItem(buildStaticAuthLocalStorageKey(specId), JSON.stringify(credentials));
    }

    public static getStaticAuthCredentials(specId: string): StaticAuthCredentials | undefined {
        return this.tryGetFromLocalStorage<StaticAuthCredentials>(buildStaticAuthLocalStorageKey(specId));
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
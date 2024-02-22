import {ApiAuthenticationStatus} from "@/app/lib/model/ApiAuthenticationStatus";
import {AuthLocalStorage} from "@/app/lib/localstorage/AuthLocalStorage";
import {ApiContext} from "@/app/lib/model/ApiContext";
import {jwtDecode} from "jwt-decode";

export class AuthService  {

    public static getApiAuthenticationStatus(apiContext: ApiContext | undefined): ApiAuthenticationStatus {
        const authenticationConfig = apiContext?.config?.authenticationConfig;

        if (!apiContext) {
            return {
                isAuthenticationRequired: false,
                isAuthenticated: false
            };
        }

        if (!authenticationConfig) {
            return {
                isAuthenticationRequired: false,
                isAuthenticated: false,
            }
        }

        switch (authenticationConfig.authenticationType) {
            case "NONE": {
                return {
                    isAuthenticationRequired: false,
                    isAuthenticated: false
                }
            }
            case "ACCESS_TOKEN": {
                return this.getAccessTokenAuthenticationStatus(apiContext);
            }
            default:
                return {
                    isAuthenticationRequired: true,
                    isAuthenticated: false
                };
        }
    }

    public static getHttpBearerAuthenticationStatus(apiContext: ApiContext): ApiAuthenticationStatus {
        const accessToken = AuthLocalStorage.getBearerAuthCredentials(apiContext);
        return this.buildJwtAuthenticationStatus(accessToken?.bearer || '');
    }

    public static getAccessTokenAuthenticationStatus(apiContext: ApiContext): ApiAuthenticationStatus {
        const accessToken = AuthLocalStorage.getAccessToken(apiContext);
        return this.buildJwtAuthenticationStatus(accessToken || '');
    }

    static buildJwtAuthenticationStatus(jwtString: string): ApiAuthenticationStatus {
        let isAuthenticated = false;

        if (jwtString) {
            try {
                const jwt: any = jwtDecode(jwtString);

                if (jwt && jwt.exp) {
                    const jwtExpirationDate = new Date(jwt.exp * 1000);
                    if (new Date() < jwtExpirationDate) {
                        isAuthenticated = true;
                    }
                }
            } catch (error: any) {
                console.log('Failed to parse access token');

                return {
                    isAuthenticationRequired: true,
                    isAuthenticated: true
                }
            }
        }

        return {
            isAuthenticationRequired: true,
            isAuthenticated: isAuthenticated,
        };
    }
}
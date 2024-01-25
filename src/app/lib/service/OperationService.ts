import {
    ApiAuthenticationConfig
} from "@/app/lib/dto/ApiAuthenticationConfig";
import { XHRFrontRequestMethod } from "@/app/lib/dto/XHRFrontRequest";
import { OperationInputs } from "@/app/lib/model/OperationInputs";
import { StandaloneOperation } from "@/app/lib/model/StandaloneOperation";
import { OpenAPIV3 } from "openapi-types";
import HttpMethods = OpenAPIV3.HttpMethods;
import { ProxyApi } from "@/app/lib/api/ProxyApi";
import { AuthLocalStorage } from "@/app/lib/localstorage/AuthLocalStorage";
import { ServerLocalStorage } from "@/app/lib/localstorage/ServerLocalStorage";
import { ParameterWithValue } from "@/app/lib/model/ParameterWithValue";
import { ApiContext } from "../model/ApiContext";
import {SecurityScheme} from "@/app/lib/model/SecurityScheme";
import {getSecurityScheme} from "@/app/lib/openapi/utils";

const buildUrl = (
    parameters: ParameterWithValue[],
    operation: StandaloneOperation,
    apiContext: ApiContext): string => {
    const baseUrl = ServerLocalStorage.getApiServer(apiContext)?.url;
    let url = `${baseUrl}${operation.path}`

    parameters
        .filter(p => p.value)
        .filter(p => p.parameter.in === 'path')
        .forEach(p => {
            url = url.replace(`{${p.parameter.name}}`, p.value)
        });

    let queryParams = ''

    parameters
        .filter(p => p.value)
        .filter(p => p.parameter.in === 'query')
        .forEach((p, index) => {
            if (index > 0) {
                queryParams += '&'
            } else {
                queryParams += '?'
            }

            queryParams += `${p.parameter.name}=${p.value}`
        });

    url = url + queryParams;

    return url;
}

export class OperationService {

    public static async executeOperation(
        inputs: OperationInputs,
        operation: StandaloneOperation,
        apiContext: ApiContext,
        timeout: number = 30000): Promise<Response> {

        const apiConfig = apiContext.config;
        const isCORSByPassed = apiConfig.isCorsByPassed;

        const buildMethod = (): XHRFrontRequestMethod => {
            switch (operation.method) {
                case OpenAPIV3.HttpMethods.DELETE:
                    return "DELETE";
                case OpenAPIV3.HttpMethods.GET:
                    return "GET";
                case OpenAPIV3.HttpMethods.HEAD:
                    return "HEAD";
                case OpenAPIV3.HttpMethods.OPTIONS:
                    return "OPTIONS";
                case HttpMethods.PATCH:
                    return "PATCH";
                case OpenAPIV3.HttpMethods.POST:
                    return "POST";
                case HttpMethods.PUT:
                    return "PUT";
                case OpenAPIV3.HttpMethods.TRACE:
                    return "TRACE";
                default:
                    throw new Error(`Non-handled HTTP method: ${operation.method}`);
            }
        }

        const buildUrlWithParameters = (): string => {
            return buildUrl(inputs.parameters, operation, apiContext);
        }

        const buildHeaders = (securityScheme: SecurityScheme | undefined, authConfig: ApiAuthenticationConfig | undefined): HeadersInit => {
            let headers: HeadersInit = {};

            if (inputs.body?.contentType) {
                headers['Content-Type'] = inputs.body.contentType;
            }

            if (securityScheme) {
                if (securityScheme.object.type === "oauth2") {
                    const oauth2AccessToken = AuthLocalStorage.getSecuritySchemeOauth2AccessToken(securityScheme.key);

                    if (oauth2AccessToken) {
                        headers['Authorization'] = `Bearer ${oauth2AccessToken}`;
                    } else {
                        console.log('Failed to retrieve OAuth2 access token from localstorage');
                    }
                } else if (securityScheme.object.type === "http") {
                    if (securityScheme.object.scheme === "basic") {
                        const credentials = AuthLocalStorage.getBasicAuthCredentials(apiContext);
                        const base64credentials = btoa(`${credentials?.username}:${credentials?.password}`)
                        headers['Authorization'] = `Basic ${base64credentials}`;
                    } else if (securityScheme.object.scheme === "bearer") {
                        headers['Authorization'] = 'Bearer ' + AuthLocalStorage.getStaticAuthCredentials(apiContext)?.secret ?? '';
                    }
                }
            } else if (authConfig) {
                if (authConfig.authenticationType === "ACCESS_TOKEN") {
                    headers['Authorization'] = `Bearer ${AuthLocalStorage.getAccessToken(apiContext)}`;
                }
            }

            return headers;
        };

        const buildBody = (): BodyInit | null => {
            if (!inputs.body?.contentType) {
                return null;
            }

            if (inputs.body.contentType === "application/json") {
                return inputs.body ? JSON.stringify(inputs.body.content) : null;
            } else if (inputs.body.contentType === "application/x-www-form-urlencoded") {
                const formBody = [];
                for (const property in inputs.body) {
                    const encodedKey = encodeURIComponent(property);
                    const encodedValue = encodeURIComponent(inputs.body.content[property]);
                    formBody.push(encodedKey + "=" + encodedValue);
                }
                return formBody.join("&");
            } else if (inputs.body.contentType === "application/octet-stream") {
                return inputs.body.content ? inputs.body.content : null
            } else {
                throw new Error(`Non-handled contentType: ${inputs.body.contentType}`);
            }
        }

        const securityScheme = getSecurityScheme(operation);

        const method = buildMethod();
        const url = buildUrlWithParameters();
        const headers = buildHeaders(securityScheme, apiConfig.authenticationConfig);
        const body = buildBody();

        if (isCORSByPassed) {
            return ProxyApi.queryProxy({
                method: method,
                headers: headers,
                path: url,
                body: body,
            },
                timeout);
        } else {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), timeout);

            return fetch(url, {
                method: method,
                headers: headers,
                body: body,
                signal: controller.signal
            }).finally(() => clearTimeout(timeoutId));
        }
    }
}
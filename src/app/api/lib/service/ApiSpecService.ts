import { ApiErrorCode } from "@/app/common/ApiErrorCode";
import { Problem } from "@/app/lib/dto/Problem";
import { getApiServers, resolveApiBaseUrl } from "@/app/lib/openapi/utils";
import OpenAPIParser from "@readme/openapi-parser";
import { OpenAPIV3 } from "openapi-types";

const resolveDefaultApiBaseUrl = (openApiV3: OpenAPIV3.Document<{}>) => {
    const apiServers = getApiServers(openApiV3);
    if (apiServers.length > 0) {
        return resolveApiBaseUrl(apiServers[0]);
    } else {
        return undefined;
    }
}

export class ApiSpecService {
    public static normalizeApiSpecPlainText(apiSpecPlainText: string): string {
        return apiSpecPlainText
            .replace(/"type"\s*:\s*"Object"/gi, '"type": "object"')
            .replace(/"type"\s*:\s*"JSON"/gi, '"type": "object"');
    }

    public static checkSpecVersion = (apiSpec: OpenAPIV3.Document) => {
        const specVersion = apiSpec.openapi;

        if (!specVersion?.startsWith("3")) {
            throw {
                message: `HopFront supports only OpenAPI specifications with a version equal to or greater than v3.0.0.`
            };
        }
    }

    public static getSpecValidationProblemOrUndefined = async (apiSpec: OpenAPIV3.Document): Promise<Problem | undefined> => {
        const deepCopy = JSON.parse(JSON.stringify(apiSpec)); // OpenAPIParser.validate(deepCopy) is modifying the object during validation.

        const errorCodes = [];
        const defaultApiBaseUrl = resolveDefaultApiBaseUrl(apiSpec);

        if (!defaultApiBaseUrl || !defaultApiBaseUrl.startsWith("http")) {
            errorCodes.push(ApiErrorCode.NoDefaultServersError);
        }

        try {
            await OpenAPIParser.validate(deepCopy);
        } catch (error: any) {
            console.log('Error validating OpenAPI spec', error);
            errorCodes.push(ApiErrorCode.SpecValidationError);
        }

        return errorCodes.length > 0 ? {
            status: 400,
            title: 'OpenAPI spec validation failed',
            detail: '',
            codes: errorCodes
        } : undefined;
    }

}
import {OpenAPIRepository} from "@/app/api/lib/repository/OpenAPIRepository";
import OpenAPIParser from "@readme/openapi-parser";

import {problemResponse} from "@/app/api/lib/utils/utils";
import {ApiSpecImportRequestBody} from "@/app/lib/dto/ApiSpecImportRequestBody";
import {buildApiSpecId, getApiServers, getRestrictedApiUrls, resolveApiBaseUrl} from "@/app/lib/openapi/utils";
import {NextResponse} from "next/server";
import {OpenAPIV3} from "openapi-types";
import {OpenAPIExtensionService} from "@/app/api/lib/service/OpenAPIExtensionService";
import { ApiErrorCode } from "@/app/common/ApiErrorCode";

const resolveDefaultApiBaseUrl = (openApiV3: OpenAPIV3.Document<{}>) => {
    const apiServers = getApiServers(openApiV3);
    if (apiServers.length > 0) {
        return resolveApiBaseUrl(apiServers[0]);
    } else {
        return undefined;
    }
}

export async function POST(req: Request) {
    const body: ApiSpecImportRequestBody = await req.json()

    console.log(`Importing OpenAPI...`);

    let apiSpecId = '';
    const skipNoDefaultServersError = body.skipNoDefaultServers || false;

    try {
        if (body.apiSpecBaseUrl) {
            const restrictedImportUrls = getRestrictedApiUrls();

            if (restrictedImportUrls.length > 0) {
                if (restrictedImportUrls.indexOf(body.apiSpecBaseUrl) < 0) {
                    return problemResponse({
                        status: 400,
                        title: 'Cannot import URL that is not configured as restricted.',
                        detail: ''
                    });
                }
            }
            const api = await OpenAPIParser.parse(body.apiSpecBaseUrl);
            apiSpecId = buildApiSpecId(api);
            const defaultApiBaseUrl = resolveApiBaseUrl(getApiServers(api as OpenAPIV3.Document)[0]);
            if ((defaultApiBaseUrl && defaultApiBaseUrl.startsWith("http")) || skipNoDefaultServersError) {
                OpenAPIRepository.getInstance().saveApiSpec(apiSpecId, JSON.stringify(api));
                OpenAPIExtensionService.createDocumentExtension({
                    id: apiSpecId,
                    document: api as OpenAPIV3.Document
                });
            } else {
                return problemResponse({
                    status: 400,
                    title: 'OpenAPI specification is missing a valid default server.',
                    detail: '',
                    code: ApiErrorCode.NoDefaultServersError
                });
            }
        } else if (body.apiSpecPlainText) {
            const parsedOpenApi = JSON.parse(body.apiSpecPlainText);
            const validatedOpenApi = await OpenAPIParser.validate(parsedOpenApi);
            const defaultApiBaseUrl = resolveDefaultApiBaseUrl(validatedOpenApi as OpenAPIV3.Document);
            if ((defaultApiBaseUrl && defaultApiBaseUrl.startsWith("http")) || skipNoDefaultServersError) {
                apiSpecId = buildApiSpecId(validatedOpenApi);
                OpenAPIRepository.getInstance().saveApiSpec(apiSpecId, body.apiSpecPlainText);
                const documentSpec = OpenAPIRepository.getInstance().getDocumentSpec(apiSpecId)!;
                OpenAPIExtensionService.createDocumentExtension({
                    id: apiSpecId,
                    document: JSON.parse(documentSpec) as OpenAPIV3.Document
                })
            } else {
                return problemResponse({
                    status: 400,
                    title: 'OpenAPI specification is missing a valid default server.',
                    detail: '',
                    code: ApiErrorCode.NoDefaultServersError
                });
            }
        } else {
            return problemResponse({
                status: 400,
                title: 'Missing OpenAPI Spec',
                detail: ''
            });
        }
    } catch (error: any) {
        return problemResponse({
            status: 400,
            title: 'Failed to validate OpenAPI spec',
            detail: error.message
        });
    }

    return NextResponse.json({'apiSpecId': apiSpecId}, {status: 201, statusText: 'Created'});
}
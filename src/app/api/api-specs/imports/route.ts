import {OpenAPIRepository} from "@/app/api/lib/repository/OpenAPIRepository";
import OpenAPIParser from "@readme/openapi-parser";

import {problemResponse} from "@/app/api/lib/utils/utils";
import {ApiSpecImportRequestBody} from "@/app/lib/dto/ApiSpecImportRequestBody";
import {getApiServers, randomInternalId, resolveApiBaseUrl} from "@/app/lib/openapi/utils";
import {NextResponse} from "next/server";
import {OpenAPIV3} from "openapi-types";
import {OpenAPIExtensionService} from "@/app/api/lib/service/OpenAPIExtensionService";
import { ApiErrorCode } from "@/app/common/ApiErrorCode";
import {ApiSpec} from "@/app/lib/dto/ApiSpec";

const resolveDefaultApiBaseUrl = (openApiV3: OpenAPIV3.Document<{}>) => {
    const apiServers = getApiServers(openApiV3);
    if (apiServers.length > 0) {
        return resolveApiBaseUrl(apiServers[0]);
    } else {
        return undefined;
    }
}

const buildApiSpecId = (existingApiSpecs: ApiSpec[]) => {
    const randomApiSpecId = () => {
        return randomInternalId(5);
    };

    let apiSPecIdHypothesis = randomApiSpecId();

    while (existingApiSpecs.find(s => s.id === apiSPecIdHypothesis)) {
        apiSPecIdHypothesis = randomApiSpecId();
    }

    return apiSPecIdHypothesis;
}

export async function POST(req: Request) {
    const body: ApiSpecImportRequestBody = await req.json()

    console.log(`Importing OpenAPI...`);

    const skipNoDefaultServersError = body.skipNoDefaultServers || false;

    const existingApiSpecs = OpenAPIRepository.getInstance().getApiSpecs();

    try {
        if (body.apiSpecBaseUrl) {
            const api = await OpenAPIParser.parse(body.apiSpecBaseUrl);
            const apiSpecId = buildApiSpecId(existingApiSpecs);
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

            return NextResponse.json({'apiSpecId': apiSpecId}, {status: 201, statusText: 'Created'});
        } else if (body.apiSpecPlainText) {
            const parsedOpenApi = JSON.parse(body.apiSpecPlainText);
            const validatedOpenApi = await OpenAPIParser.validate(parsedOpenApi);
            const defaultApiBaseUrl = resolveDefaultApiBaseUrl(validatedOpenApi as OpenAPIV3.Document);

            if ((defaultApiBaseUrl && defaultApiBaseUrl.startsWith("http")) || skipNoDefaultServersError) {
                const apiSpecId = buildApiSpecId(existingApiSpecs);
                OpenAPIRepository.getInstance().saveApiSpec(apiSpecId, body.apiSpecPlainText);
                const documentSpec = OpenAPIRepository.getInstance().getDocumentSpec(apiSpecId)!;
                OpenAPIExtensionService.createDocumentExtension({
                    id: apiSpecId,
                    document: JSON.parse(documentSpec) as OpenAPIV3.Document
                })

                return NextResponse.json({'apiSpecId': apiSpecId}, {status: 201, statusText: 'Created'});
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
}
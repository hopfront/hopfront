import { OpenAPIRepository } from "@/app/api/lib/repository/OpenAPIRepository";
import OpenAPIParser from "@readme/openapi-parser";

import { OpenAPIExtensionService } from "@/app/api/lib/service/OpenAPIExtensionService";
import { problemResponse } from "@/app/api/lib/utils/utils";
import { ApiErrorCode } from "@/app/common/ApiErrorCode";
import { ApiSpec } from "@/app/lib/dto/ApiSpec";
import { ApiSpecImportRequestBody } from "@/app/lib/dto/ApiSpecImportRequestBody";
import { Problem } from "@/app/lib/dto/Problem";
import { getApiServers, randomInternalId, resolveApiBaseUrl } from "@/app/lib/openapi/utils";
import { NextResponse } from "next/server";
import { OpenAPIV3 } from "openapi-types";
import { InstanceRepository } from "../../lib/repository/InstanceRepository";
import { cookies } from "next/headers";

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

const getSpecValidationProblemOrUndefined = async (apiSpec: OpenAPIV3.Document): Promise<Problem | undefined> => {
    const errorCodes = [];
    const defaultApiBaseUrl = resolveDefaultApiBaseUrl(apiSpec as OpenAPIV3.Document);

    if (!defaultApiBaseUrl || !defaultApiBaseUrl.startsWith("http")) {
        errorCodes.push(ApiErrorCode.NoDefaultServersError);
    }

    try {
        await OpenAPIParser.validate(apiSpec);
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

const checkSpecVersion = (apiSpec: OpenAPIV3.Document) => {
    const specVersion = apiSpec.openapi;

    if (!specVersion?.startsWith("3")) {
        throw {
            message : `HopFront supports only OpenAPI specifications with a version equal to or greater than v3.0.0.`
        };
    }
}

export async function POST(req: Request) {
    if (!InstanceRepository.isUserAuthorized(cookies())) {
        return NextResponse.json({'message': 'You do not have the rights to import an OpenAPI specification.'}, { status: 403 })
    }
    
    const body: ApiSpecImportRequestBody = await req.json()

    console.log(`Importing OpenAPI...`);

    const skipSpecImportWarnings = body.skipSpecImportWarnings || false;

    const existingApiSpecs = OpenAPIRepository.getInstance().getApiSpecs();

    try {
        if (body.apiSpecBaseUrl) {
            const api = await OpenAPIParser.parse(body.apiSpecBaseUrl);
            const apiSpecId = buildApiSpecId(existingApiSpecs);
            const defaultApiBaseUrl = resolveApiBaseUrl(getApiServers(api as OpenAPIV3.Document)[0]);

            checkSpecVersion(api as OpenAPIV3.Document);

            if ((defaultApiBaseUrl && defaultApiBaseUrl.startsWith("http")) || skipSpecImportWarnings) {
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
                    codes: [ApiErrorCode.NoDefaultServersError]
                });
            }

            return NextResponse.json({ 'apiSpecId': apiSpecId }, { status: 201, statusText: 'Created' });
        } else if (body.apiSpecPlainText) {
            const normalizedPlainText = body.apiSpecPlainText
                .replace(/"type"\s*:\s*"Object"/gi, '"type": "object"')
                .replace(/"type"\s*:\s*"JSON"/gi, '"type": "object"');
            const parsedOpenApi = JSON.parse(normalizedPlainText);

            checkSpecVersion(parsedOpenApi as OpenAPIV3.Document);

            let specValidationProblem: Problem | undefined;

            if (!body.skipSpecImportWarnings) {
                specValidationProblem = await getSpecValidationProblemOrUndefined(parsedOpenApi as OpenAPIV3.Document);
            }

            if (!specValidationProblem || skipSpecImportWarnings) {
                const apiSpecId = buildApiSpecId(existingApiSpecs);
                OpenAPIRepository.getInstance().saveApiSpec(apiSpecId, normalizedPlainText);
                const documentSpec = OpenAPIRepository.getInstance().getDocumentSpec(apiSpecId)!;
                OpenAPIExtensionService.createDocumentExtension({
                    id: apiSpecId,
                    document: JSON.parse(documentSpec) as OpenAPIV3.Document
                });
                return NextResponse.json({ 'apiSpecId': apiSpecId }, { status: 201, statusText: 'Created' });
            } else {
                return problemResponse(specValidationProblem);
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
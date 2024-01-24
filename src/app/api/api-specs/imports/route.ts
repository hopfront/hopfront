import { OpenAPIRepository } from "@/app/api/lib/repository/OpenAPIRepository";
import OpenAPIParser from "@readme/openapi-parser";

import { OpenAPIExtensionService } from "@/app/api/lib/service/OpenAPIExtensionService";
import { problemResponse } from "@/app/api/lib/utils/utils";
import { ApiSpec } from "@/app/lib/dto/ApiSpec";
import { ApiSpecImportRequestBody } from "@/app/lib/dto/ApiSpecImportRequestBody";
import { randomInternalId } from "@/app/lib/openapi/utils";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { OpenAPIV3 } from "openapi-types";
import { InstanceRepository } from "../../lib/repository/InstanceRepository";
import { ApiSpecService } from "../../lib/service/ApiSpecService";

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

const saveApiSpecFromUrl = async (
    url: string,
    skipSpecImportWarnings: boolean
) => {
    const api = await OpenAPIParser.parse(url) as OpenAPIV3.Document;

    ApiSpecService.checkSpecVersion(api);
    const specValidationProblem = await ApiSpecService.getSpecValidationProblemOrUndefined(api);

    const specAsText = JSON.stringify(api);
    const normalizedSpecText = ApiSpecService.normalizeApiSpecPlainText(specAsText);

    if (!specValidationProblem || skipSpecImportWarnings) {
        const existingApiSpecs = OpenAPIRepository.getInstance().getApiSpecs();
        const apiSpecId = buildApiSpecId(existingApiSpecs);
        OpenAPIRepository.getInstance().saveApiSpec(apiSpecId, normalizedSpecText);
        OpenAPIExtensionService.createDocumentExtension({
            id: apiSpecId,
            document: api
        });
        return NextResponse.json({ 'apiSpecId': apiSpecId }, { status: 201, statusText: 'Created' });
    } else {
        return problemResponse(specValidationProblem);
    }
}

const saveApiSpecFromPlainText = async (apiSpecPlainText: string, skipSpecImportWarnings: boolean) => {
    const normalizedPlainText = ApiSpecService.normalizeApiSpecPlainText(apiSpecPlainText);
    const parsedOpenApi = JSON.parse(normalizedPlainText);

    ApiSpecService.checkSpecVersion(parsedOpenApi);
    const specValidationProblem = await ApiSpecService.getSpecValidationProblemOrUndefined(parsedOpenApi);

    if (!specValidationProblem || skipSpecImportWarnings) {
        const existingApiSpecs = OpenAPIRepository.getInstance().getApiSpecs();
        const apiSpecId = buildApiSpecId(existingApiSpecs);
        OpenAPIRepository.getInstance().saveApiSpec(apiSpecId, normalizedPlainText);
        OpenAPIExtensionService.createDocumentExtension({
            id: apiSpecId,
            document: parsedOpenApi
        });
        return NextResponse.json({ 'apiSpecId': apiSpecId }, { status: 201, statusText: 'Created' });
    } else {
        return problemResponse(specValidationProblem);
    }
}

export async function POST(req: Request) {
    if (!InstanceRepository.isUserAuthorized(cookies())) {
        return NextResponse.json({ 'message': 'You do not have the rights to import an OpenAPI specification.' }, { status: 403 })
    }

    const body: ApiSpecImportRequestBody = await req.json()
    const skipSpecImportWarnings = body.skipSpecImportWarnings || false;

    try {
        console.log(`Importing OpenAPI...`);

        if (body.apiSpecBaseUrl) {
            return saveApiSpecFromUrl(body.apiSpecBaseUrl, skipSpecImportWarnings);
        } else if (body.apiSpecPlainText) {
            return saveApiSpecFromPlainText(body.apiSpecPlainText, skipSpecImportWarnings)
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
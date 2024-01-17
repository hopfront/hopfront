import { InstanceRepository } from "@/app/api/lib/repository/InstanceRepository";
import { OpenAPIRepository } from "@/app/api/lib/repository/OpenAPIRepository";
import { ApiSpecService } from "@/app/api/lib/service/ApiSpecService";
import { problemResponse } from "@/app/api/lib/utils/utils";
import { ApiSpecUpdateRequestBody } from "@/app/lib/dto/ApiSpecUpdateRequestBody";
import OpenAPIParser from "@readme/openapi-parser";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { OpenAPIV3 } from "openapi-types";

const updateApiSpecByUrl = async (
    url: string,
    apiSpecId: string,
    skipSpecImportWarnings: boolean
) => {
    const api = await OpenAPIParser.parse(url) as OpenAPIV3.Document;

    ApiSpecService.checkSpecVersion(api);
    const specValidationProblem = await ApiSpecService.getSpecValidationProblemOrUndefined(api);

    if (!specValidationProblem || skipSpecImportWarnings) {
        OpenAPIRepository.getInstance().saveApiSpec(apiSpecId, JSON.stringify(api));
    } else {
        return problemResponse(specValidationProblem);
    }

    return NextResponse.json({ 'apiSpecId': apiSpecId }, { status: 200, statusText: 'Updated' });
}

const updateApiSpecByText = async (
    apiSpecPlainText: string,
    apiSpecId: string,
    skipSpecImportWarnings: boolean
) => {
    const normalizedPlainText = ApiSpecService.normalizeApiSpecPlainText(apiSpecPlainText);
    const parsedOpenApi = JSON.parse(normalizedPlainText) as OpenAPIV3.Document;
    const api = await OpenAPIParser.parse(parsedOpenApi) as OpenAPIV3.Document;

    ApiSpecService.checkSpecVersion(api);
    const specValidationProblem = await ApiSpecService.getSpecValidationProblemOrUndefined(api);

    if (!specValidationProblem || skipSpecImportWarnings) {
        OpenAPIRepository.getInstance().saveApiSpec(apiSpecId, normalizedPlainText);
    } else {
        return problemResponse(specValidationProblem);
    }

    return NextResponse.json({ 'apiSpecId': apiSpecId }, { status: 200, statusText: 'Updated' });
}

export async function POST(req: Request) {
    if (!InstanceRepository.isUserAuthorized(cookies())) {
        return NextResponse.json({ 'message': 'You do not have the rights to update an OpenAPI specification.' }, { status: 403 })
    }
    const apiSpecId = req.url.split('/')[5];
    const body = await req.json() as ApiSpecUpdateRequestBody
    const skipSpecImportWarnings = body.skipSpecImportWarnings || false;

    try {
        console.log("Updating OpenApi...")
        
        if (body.apiSpecBaseUrl) {
            return updateApiSpecByUrl(body.apiSpecBaseUrl, apiSpecId, skipSpecImportWarnings);
        } else if (body.apiSpecPlainText) {
            return updateApiSpecByText(body.apiSpecPlainText, apiSpecId, skipSpecImportWarnings);
        } else {
            return problemResponse({
                status: 400,
                title: 'Missing OpenAPI Spec',
                detail: ''
            });
        }
    } catch (e: any) {
        return problemResponse({
            status: 400,
            title: 'Failed to validate OpenAPI spec',
            detail: e.message
        });
    }
}
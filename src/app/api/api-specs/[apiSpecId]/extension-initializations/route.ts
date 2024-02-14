import { problemResponse } from "@/app/api/lib/utils/utils";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { InstanceRepository } from "../../../lib/repository/InstanceRepository";
import {OpenAPIRepository} from "@/app/api/lib/repository/OpenAPIRepository";
import {OpenAPIExtensionService} from "@/app/api/lib/service/OpenAPIExtensionService";


export async function POST(req: Request) {
    if (!InstanceRepository.isUserAuthorized(cookies())) {
        return NextResponse.json({ 'message': 'You do not have the rights to initialize an OpenAPI extension initialization.' }, { status: 403 })
    }

    const apiSpecId = req.url.split('/')[5];

    const documentSpec = OpenAPIRepository.getInstance().getDocumentSpec(apiSpecId);

    if (!documentSpec) {
        return problemResponse({
            status: 404,
            title: `Could not find API spec with id=${apiSpecId}`,
        });
    }

    const document = JSON.parse(documentSpec);

    OpenAPIExtensionService.initializeDocumentExtension({
        id: apiSpecId,
        document: document
    });

    return NextResponse.json({ 'apiSpecId': apiSpecId }, { status: 200 });
}
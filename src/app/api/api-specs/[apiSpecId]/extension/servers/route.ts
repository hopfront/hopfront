import { OpenAPIRepository } from "@/app/api/lib/repository/OpenAPIRepository";
import { NextResponse } from "next/server";
import { getRestrictedApiUrls } from "@/app/lib/openapi/utils";
import { problemResponse } from "@/app/api/lib/utils/utils";
import { OpenAPIV3 } from "openapi-types";
import ServerObject = OpenAPIV3.ServerObject;

export async function PUT(req: Request) {
    if (getRestrictedApiUrls().length > 0) {
        return problemResponse({
            status: 400,
            title: 'Cannot update API spec extension.',
            detail: ''
        });
    }

    const apiSpecId = req.url.split('/')[5];
    const body: ServerObject[] = await req.json()
    OpenAPIRepository.getInstance().saveServersExtension(apiSpecId, body);
    return NextResponse.json({});
}
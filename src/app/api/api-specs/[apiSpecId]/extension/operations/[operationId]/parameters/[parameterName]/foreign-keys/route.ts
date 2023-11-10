import { OpenAPIRepository } from "@/app/api/lib/repository/OpenAPIRepository";
import {ForeignKey} from "@/app/lib/dto/OpenApiExtensions";
import { NextResponse } from "next/server";
import {getRestrictedApiUrls} from "@/app/lib/openapi/utils";
import { problemResponse } from "@/app/api/lib/utils/utils";

export async function POST(req: Request) {
    if (getRestrictedApiUrls().length > 0) {
        return problemResponse({
            status: 400,
            title: 'Cannot update API spec extension.',
            detail: ''
        });
    }

    const apiSpecId = req.url.split('/')[5];
    const operationId = req.url.split('/')[8];
    const parameterName = req.url.split('/')[10];

    const foreignKey: ForeignKey = await req.json()

    OpenAPIRepository.getInstance().addOperationParameterExtensionForeignKey(
        apiSpecId, operationId, parameterName, foreignKey);

    return NextResponse.json({});
}
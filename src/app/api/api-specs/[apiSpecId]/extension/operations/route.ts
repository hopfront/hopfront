import {OpenAPIRepository} from "@/app/api/lib/repository/OpenAPIRepository";
import {OperationExtension} from "@/app/lib/dto/OpenApiExtensions";
import {NextResponse} from "next/server";
import {getRestrictedApiUrls} from "@/app/lib/openapi/utils";
import {problemResponse} from "@/app/api/lib/utils/utils";

export async function PUT(req: Request) {
    if (getRestrictedApiUrls().length > 0) {
        return problemResponse({
            status: 400,
            title: 'Cannot update API spec extension.',
            detail: ''
        });
    }

    const apiSpecId = req.url.split('/')[5];
    const body: OperationExtension = await req.json()
    OpenAPIRepository.getInstance().saveOperationExtension(apiSpecId, body);
    return NextResponse.json({});
}
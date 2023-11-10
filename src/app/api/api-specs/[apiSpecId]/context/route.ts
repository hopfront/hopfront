import { OpenAPIRepository } from "@/app/api/lib/repository/OpenAPIRepository";
import { NextResponse } from "next/server";
import { Problem } from "@/app/lib/dto/Problem";
import { ApiContext } from "@/app/lib/model/ApiContext";
import { problemResponse } from "@/app/api/lib/utils/utils";

export async function GET(req: Request): Promise<NextResponse<ApiContext | Problem>> {
    const apiSpecId = req.url.split('/')[5];

    const documentSpec = OpenAPIRepository.getInstance().getDocumentSpec(apiSpecId);

    if (!documentSpec) {
        return problemResponse({
            title: `No spec found with id=${apiSpecId}`,
            detail: '',
            status: 404,
        });
    }

    return NextResponse.json({
        apiSpec: {
            id: apiSpecId,
            document: JSON.parse(documentSpec)
        },
        extension: OpenAPIRepository.getInstance().getExtension(apiSpecId),
        config: OpenAPIRepository.getInstance().getApiConfig(apiSpecId)
    } as ApiContext);
}
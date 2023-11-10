import {OpenAPIRepository} from "@/app/api/lib/repository/OpenAPIRepository";
import {OpenAPIDocumentExtension} from "@/app/lib/dto/OpenApiExtensions";
import {NextResponse} from "next/server";
import {Problem} from "@/app/lib/dto/Problem";

export async function GET(req: Request): Promise<NextResponse<OpenAPIDocumentExtension | Problem>> {
    const apiSpecId = req.url.split('/')[5];
    const extension = OpenAPIRepository.getInstance().getExtension(apiSpecId)
    return NextResponse.json(extension);
}
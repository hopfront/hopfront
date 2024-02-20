import {OpenAPIRepository} from "@/app/api/lib/repository/OpenAPIRepository";
import {OperationExtension, SecuritySchemeExtension} from "@/app/lib/dto/OpenApiExtensions";
import {NextResponse} from "next/server";

export async function PUT(req: Request) {
    const apiSpecId = req.url.split('/')[5];
    const body: SecuritySchemeExtension = await req.json()
    OpenAPIRepository.getInstance().saveSecuritySchemeExtension(apiSpecId, body);
    return NextResponse.json({});
}